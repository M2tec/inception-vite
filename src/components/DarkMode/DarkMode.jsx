import React from "react";

import Sun from './Sun.svg?react'; 
import Moon from './Moon.svg?react'; 
import "./DarkMode.css";
import { useAppState, useStateDispatch } from '../../AppContext';

const DarkMode = () => {
    const dispatch = useStateDispatch();
    let {theme} = useAppState();

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={e => {
                    dispatch({
                      type: 'theme',
                      id: 'test'
                      })}}
                defaultChecked={theme === "dark"}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;
