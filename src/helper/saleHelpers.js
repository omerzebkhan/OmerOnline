// saleHelpers.js
import inventoryService from "../services/inventory.service";
import itemService from "../services/item.services";

/**
 * Submit new sale items for an invoice.
 * Updates stock, creates sale details, recalculates invoice, logs edits.
 * @param {Array} invoiceItems - array of items to submit
 * @param {string|number} saleInvoice - current sale invoice id
 * @param {Function} fetchSaleByDate - redux fetch function
 * @param {Array} cCustomer - selected customer array
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<void>}
 */


/**
 * Delete entire sale invoice and restore stock
 */
export const deleteSaleInvoice = async ({
    saleInvoiceId,
    saleInvoiceDetailData
}) => {
    try {
        // 1️⃣ Restore stock for all sale details
        for (const row of saleInvoiceDetailData) {
            const sdItemId = row.itemid;
            const sdQuantity = row.quantity;

            const res = await itemService.get(sdItemId);
            const { id, quantity, showroom } = res.data;

            const updatedItem = {
                quantity: parseInt(quantity) + parseInt(sdQuantity),
                showroom: parseInt(showroom) + parseInt(sdQuantity)
            };

            await itemService.update(id, updatedItem);
        }

        // 2️⃣ Delete invoice
        await inventoryService.deleteSaleInvoiceBySaleId(saleInvoiceId);

        await inventoryService.deleteSale(saleInvoiceId)



        // 3️⃣ Log delete action
        const editSaleData = {
            saleinvoiceid: saleInvoiceId,
            saledetailid: 0,
            itemid: 0,
            oldprice: 0,
            oldqty: 0,
            newprice: 0,
            newqty: 0,
            finalprice: 0,
            finalqty: 0,
            beforeqty: 0,
            comments: "deleteInvoiceHandler called"
        };

        await inventoryService.createEditSale(editSaleData);

    } catch (err) {
        throw err;
    }
};


export const submitSaleInvoiceItems = async (invoiceItems, saleInvoice, fetchSaleByDate, cCustomer, startDate, endDate) => {
    for (const item of invoiceItems) {
        // Only process new items
        if (!item[7]) { // item[7] = saleDetailId
            const sDetailData = {
                saleInvoiceId: item[8],
                itemName: item[6],
                quantity: item[2],
                price: item[3],
                cost: item[4]
            };

            // 1️⃣ Check and update stock
            const response2 = await itemService.get(item[6]);
            const { id, quantity, showroom } = response2.data;
            const itemUpdated = {
                quantity: parseInt(quantity) - parseInt(item[2]),
                showroom: parseInt(showroom) - parseInt(item[2])
            };

            if (itemUpdated.showroom < 0) {
                throw new Error(`Entered quantity for item ${id} exceeds stock`);
            }

            await inventoryService.createSaleDetail(sDetailData);
            await inventoryService.getSaleRecalculate(sDetailData.saleInvoiceId);
            await itemService.update(id, itemUpdated);

            // 2️⃣ Log the edit in EditSale table
            const editSaleData = {
                saleinvoiceid: sDetailData.saleInvoiceId,
                saledetailid: 0,
                itemid: id,
                oldprice: 0,
                oldqty: 0,
                newprice: 0,
                newqty: parseInt(item[2]),
                finalprice: 0,
                finalqty: itemUpdated.quantity,
                beforeqty: quantity,
                comments: 'submitInvoiceHandler called'
            };
            await inventoryService.createEditSale(editSaleData);

            // 3️⃣ Refresh saleData
            if (cCustomer.length > 0) {
                fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), cCustomer[0].id, "0", "0", "0");
            } else {
                fetchSaleByDate(startDate.toDateString(), endDate.toDateString(), "0", "0", "0", "0");
            }
        }
    }
};


export const deleteSaleDetail = async (sdId, sdItemId, sdOldQuantity, sInvoiceId) => {
    try {
        // 1️⃣ Get current item stock
        const response2 = await itemService.get(sdItemId);
        const { id, quantity, showroom } = response2.data;

        // 2️⃣ Update stock
        const itemUpdated = {
            quantity: parseInt(quantity) + parseInt(sdOldQuantity),
            showroom: parseInt(showroom) + parseInt(sdOldQuantity)
        };
        await itemService.update(id, itemUpdated);

        // 3️⃣ Delete sale detail
        await inventoryService.deleteSaleDetail(sdId);

        // 4️⃣ Recalculate invoice
        await inventoryService.getSaleRecalculate(sInvoiceId);

        // 5️⃣ Log deletion in EditSale table
        const editSaleData = {
            saleinvoiceid: sInvoiceId,
            saledetailid: sdId,
            itemid: sdItemId,
            oldprice: 0,
            oldqty: 0,
            newprice: 0,
            newqty: 0,
            finalprice: 0,
            finalqty: itemUpdated.quantity,
            beforeqty: quantity,
            comments: 'deleteRecordHandler called'
        };
        await inventoryService.createEditSale(editSaleData);

    } catch (err) {
        throw err;
    }
};



// export const mapInvoiceDetails = (saleInvoiceDetailData = []) => {
//     return saleInvoiceDetailData.map(i => ([
//         i.itemname,            // 0
//         i.itemdescription,     // 1
//         i.quantity,            // 2
//         i.price,               // 3
//         i.cost,                // 4
//         (i.price * i.quantity) - (i.cost * i.quantity), // 5
//         i.itemId,              // 6
//         i.id,                  // 7
//         i.saleInvoiceId        // 8
//     ]));
// };


export const mapInvoiceDetails = (saleInvoiceDetailData) => {
    if (!saleInvoiceDetailData || saleInvoiceDetailData.length === 0) return [];

    return saleInvoiceDetailData.map(d => ({
        detailId: d.id,
        invoiceId: d.saleInvoiceId,
        itemId: d.itemId || d.itemid,
        itemName: d.itemname || d.items?.name || 'Unknown Item',
        description: d.itemdescription || d.items?.description || '',
        quantity: d.quantity || 0,
        price: d.price || 0,
        cost: d.cost || 0,  // average cost
        total: (d.price || 0) * (d.quantity || 0),
        profit: ((d.price || 0) - (d.cost || 0)) * (d.quantity || 0),
        isNew: false
    }));
};

export const calculateProfit = (price, cost, qty) =>
    (price - cost) * qty;

export const calculateInvoiceTotal = (items = []) =>
    items.reduce((sum, i) => sum + (i.price * i.qty), 0);

export const buildInvoiceItem = ({
    name,
    description,
    qty,
    price,
    cost,
    itemId
}) => ({
    name,
    description,
    qty,
    price,
    cost,
    profit: calculateProfit(price, cost, qty),
    itemId,
    saleDetailId: null,
    saleInvoiceId: null
});

export const validateInvoiceInput = ({ qty, price }) => {
    if (!qty || qty <= 0) return "Quantity must be greater than zero";
    if (!price || price <= 0) return "Price must be greater than zero";
    return null;
};

export const calculateQtyDiff = (oldQty, newQty) =>   Number(newQty) - Number(oldQty);

export const updateInvoiceFlow = async ({
    itemId,
    qtyDiff,
    saleDetailId,
    invoiceId,
    saleDetailData
}) => {
    await updateItemStock({ itemId, qtyDiff });
    await inventoryService.updateSaleDetail(saleDetailId, saleDetailData);
    await inventoryService.getSaleRecalculate(invoiceId);
};

export const updateItemStock = async (itemId, qtyDiff) => {
    try {
        const res = await itemService.get(itemId);
        const { quantity, showroom } = res.data;
        const newQuantity = quantity + qtyDiff;
        const newShowroom = showroom + qtyDiff;

        if (newShowroom < 0) {
            throw new Error("Insufficient showroom stock");
        }

        await itemService.update(itemId, { quantity: newQuantity, showroom: newShowroom });
        return { quantity: newQuantity, showroom: newShowroom, oldQuantity: quantity };
    } catch (err) {
        throw err;
    }
};

