'use strict'

export const RENDER_CONSTANTS = {
    REGEXP: {
        R_BOLD: /\*\*(((?!\*\*).)+)\*\*/g,
        R_ITALIC: /__(((?!__).)+)__/g,
        R_STRIKE: /!!(((?!!!).)+)!!/g,
        
        R_IMG: /((?!\])\[IMG:.+)\]/g,
        R_URL: /\[URL\:((?!}).)+\}/g,
        R_CUT: /\[CUT\:((?!}).)+\}/g,
    },
    
    HTMLS: {
        GALLERY_CLOSE: '<span class="gallery-ctrls"><button type="button" class="gallery-ctrls-btn _backward"></button><button type="button" class="gallery-ctrls-btn _forward"></button></span></span>',
    },
    WORDING: {
        READ_MORE: 'Читать целиком &gt;&gt;&gt;'
    }
}