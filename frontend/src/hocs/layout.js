import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from ' .. /components/Navbar';
import { connect } from 'react-redux';
import { googleAuthenticate } from ' .. /actions/auth'; 

const Layout = (props) => {
    let location = useLocation();
    
    useEffect(() => {
    const values = queryString.parse(location.search) ;
    const state = values.state ? values.state : null;
    const code = values.code ? values.code : null;
    
    console.log('State: ' + state);
    console. log('Code: ' + code);
    
    if (state && code) {
    props.googleAuthenticate(state, code);
     }
    }, [location]);
    return (
        <div>
        <Navbar />
        {props.children}
        </div>);}
        
        export default connect(null,{ googleAuthenticate })(Layout);