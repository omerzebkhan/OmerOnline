import React,{ useState,useEffect} from 'react';
import { connect } from 'react-redux';
import SearchUser from '../user/searchUser.component';

const Profit = () => {


    return(
        <div>
        <SearchUser show="Customer" />
    </div>
    )
}

export default Profit;