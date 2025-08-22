import React from 'react';
import LOGO from '../../../Logo/LOGO10.png';

const DerivShortLogo = () => {
    return (
        <div className='header__menu-left-logo'>
            <a href='https://derivstart.com/'>
                <img
                    src={LOGO}
                    alt='Deriv Short Logoo'
                    style={{ height: '25px', width: 'auto' }}
                />
            </a>
        </div>
    );
};

export default DerivShortLogo;