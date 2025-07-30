/**
 * Regional SEAMS EPA Adobe Variables Configuration
 * Configures Adobe Analytics variables based on data layer information
 */

// Constants for better maintainability
const PAGE_TEMPLATES = {
    ERROR: 'error',
    CHECKOUT: 'checkout',
    THANK_YOU: 'thank-you'
};

const EVENTS = {
    ERROR_PAGE: 'event6',
    QUANTITY: 'event119',
    PRICE: 'event120',
    SELLING_PRICE: 'event121',
    TOTAL: 'event122',
    TAX: 'event123'
};

const LOGIN_STATUS = {
    LOGGED_IN: 'Logged In',
    NOT_LOGGED_IN: 'Not Logged In'
};

const REGIONAL_VARIABLES = {
    GENRES: 'aaRegionalV169',
    TRAINING_NAME: 'aaRegionalV170',
    ORDER_ID: 'aaRegionalV171',
    PAYMENT_TYPE: 'aaRegionalV172',
    PROMO_CODE: 'aaRegionalV173'
};

/**
 * Safely gets nested object property
 * @param {Object} obj - The object to traverse
 * @param {string} path - Dot notation path (e.g., 'user.id')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} The value at the path or default value
 */
function safeGet(obj, path, defaultValue = '') {
    return path.split('.').reduce((current, key) => {
        return (current && current[key] !== undefined) ? current[key] : defaultValue;
    }, obj);
}

/**
 * Removes currency symbols and commas from price strings
 * @param {string|number} value - The price value to clean
 * @returns {string} Cleaned price string
 */
function cleanPriceValue(value) {
    return String(value).replace(/[,$]/g, '');
}

/**
 * Maps array of price values to cleaned strings
 * @param {Array} priceArray - Array of price values
 * @returns {Array} Array of cleaned price strings
 */
function cleanPriceArray(priceArray) {
    if (!Array.isArray(priceArray)) return [];
    return priceArray.map(cleanPriceValue);
}

/**
 * Sets basic page information
 * @param {Object} obj - Adobe Analytics object
 * @param {Object} datalayer - Data layer object
 */
function setBasicPageInfo(obj, datalayer) {
    const page = datalayer.page || {};
    
    obj.aaPageName = [
        page.section || '',
        page.pageTemplate || '',
        page.name || ''
    ].filter(Boolean).join(':');
    
    obj.aaPageTemplate = page.pageTemplate || '';
}

/**
 * Sets user information
 * @param {Object} obj - Adobe Analytics object
 * @param {Object} datalayer - Data layer object
 */
function setUserInfo(obj, datalayer) {
    const userId = safeGet(datalayer, 'user.id', '');
    
    obj.aaUserID = userId;
    obj.aaLoginStatus = userId ? LOGIN_STATUS.LOGGED_IN : LOGIN_STATUS.NOT_LOGGED_IN;
}

/**
 * Handles error page specific logic
 * @param {Object} obj - Adobe Analytics object
 * @param {Object} datalayer - Data layer object
 */
function handleErrorPage(obj, datalayer) {
    const pageTemplate = safeGet(datalayer, 'page.pageTemplate');
    
    if (pageTemplate === PAGE_TEMPLATES.ERROR) {
        obj.aaPageType = 'errorPage';
        obj.aaEvents.push(EVENTS.ERROR_PAGE);
    }
}

/**
 * Sets product category information
 * @param {Object} obj - Adobe Analytics object
 * @param {Object} datalayer - Data layer object
 */
function setProductCategory(obj, datalayer) {
    const category1 = safeGet(datalayer, 'product.category1', []);
    obj.aaProductCategory1 = category1;
}

/**
 * Handles article details page specific logic
 * @param {Object} obj - Adobe Analytics object
 * @param {Object} datalayer - Data layer object
 */
function handleArticleDetailsPage(obj, datalayer) {
    const pageName = safeGet(datalayer, 'page.name', '');
    
    if (/articles:details/i.test(pageName)) {
        obj[REGIONAL_VARIABLES.GENRES] = safeGet(datalayer, 'tags.genres');
        obj.aaProducts = safeGet(datalayer, 'product.model');
    }
}

/**
 * Handles checkout page specific logic
 * @param {Object} obj - Adobe Analytics object
 * @param {Object} datalayer - Data layer object
 */
function handleCheckoutPage(obj, datalayer) {
    const pageName = safeGet(datalayer, 'page.name');
    
    if (pageName === PAGE_TEMPLATES.CHECKOUT) {
        const cart = datalayer.cart || {};
        
        obj[REGIONAL_VARIABLES.TRAINING_NAME] = cart.trainingName || '';
        
        // Add cart-related events
        if (cart.quantity) {
            obj.aaEvents.push(`${EVENTS.QUANTITY}=${cart.quantity}`);
        }
        
        if (cart.price) {
            obj.aaEvents.push(`${EVENTS.PRICE}=${cleanPriceArray(cart.price).join(',')}`);
        }
        
        if (cart.sellingPrice) {
            obj.aaEvents.push(`${EVENTS.SELLING_PRICE}=${cleanPriceArray(cart.sellingPrice).join(',')}`);
        }
        
        if (cart.total) {
            obj.aaEvents.push(`${EVENTS.TOTAL}=${cleanPriceValue(cart.total)}`);
        }
    }
}

/**
 * Handles thank you page specific logic
 * @param {Object} obj - Adobe Analytics object
 * @param {Object} datalayer - Data layer object
 */
function handleThankYouPage(obj, datalayer) {
    const pageName = safeGet(datalayer, 'page.name');
    
    if (pageName === PAGE_TEMPLATES.THANK_YOU) {
        const order = datalayer.order || {};
        
        // Set order-related regional variables
        obj[REGIONAL_VARIABLES.TRAINING_NAME] = order.trainingName || '';
        obj[REGIONAL_VARIABLES.ORDER_ID] = order.id || '';
        obj[REGIONAL_VARIABLES.PAYMENT_TYPE] = order.paymentType || '';
        obj[REGIONAL_VARIABLES.PROMO_CODE] = order.promoCode || '';
        
        // Add order-related events
        if (order.quantity) {
            obj.aaEvents.push(`${EVENTS.QUANTITY}=${order.quantity}`);
        }
        
        if (order.price) {
            obj.aaEvents.push(`${EVENTS.PRICE}=${cleanPriceArray(order.price).join(',')}`);
        }
        
        if (order.sellingPrice) {
            obj.aaEvents.push(`${EVENTS.SELLING_PRICE}=${cleanPriceArray(order.sellingPrice).join(',')}`);
        }
        
        if (order.total) {
            obj.aaEvents.push(`${EVENTS.TOTAL}=${cleanPriceValue(order.total)}`);
        }
        
        if (order.tax) {
            obj.aaEvents.push(`${EVENTS.TAX}=${order.tax}`);
        }
    }
}

/**
 * Sets up custom event listeners (placeholder for future implementation)
 * @param {Object} obj - Adobe Analytics object
 * @param {Object} datalayer - Data layer object
 */
function setupCustomEventListeners(obj, datalayer) {
    // TODO: Implement once Sony's implementation is finished
    
    // Example structure for componentInteraction tracking:
    // document.addEventListener('componentInteraction', function(event) {
    //     // Handle component interaction tracking
    // });
    
    // Example structure for filtersUpdated tracking:
    // document.addEventListener('filtersUpdated', function(event) {
    //     // Handle filters updated tracking
    // });
}

/**
 * Main function to configure regional SEAMS EPA Adobe Variables
 * @param {string} origin - Origin identifier
 * @param {Object} obj - Adobe Analytics object to populate
 * @param {Object} datalayer - Data layer object containing page/user/product data
 * @returns {Object} The populated Adobe Analytics object
 */
_bsq.aa.regionalSEAMSEPAdobeVariables = function(origin, obj, datalayer) {
    // Validate inputs
    if (!obj || typeof obj !== 'object') {
        console.warn('Adobe Analytics object is not valid');
        return obj;
    }
    
    if (!datalayer || typeof datalayer !== 'object') {
        console.warn('Data layer is not valid');
        return obj;
    }
    
    // Ensure aaEvents array exists
    if (!Array.isArray(obj.aaEvents)) {
        obj.aaEvents = [];
    }
    
    try {
        // Set basic page information
        setBasicPageInfo(obj, datalayer);
        
        // Set user information
        setUserInfo(obj, datalayer);
        
        // Handle different page types
        handleErrorPage(obj, datalayer);
        setProductCategory(obj, datalayer);
        handleArticleDetailsPage(obj, datalayer);
        handleCheckoutPage(obj, datalayer);
        handleThankYouPage(obj, datalayer);
        
        // Setup custom event listeners (placeholder)
        setupCustomEventListeners(obj, datalayer);
        
    } catch (error) {
        console.error('Error in regionalSEAMSEPAdobeVariables:', error);
    }
    
    return obj;
};