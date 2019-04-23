import { Hermes, Dialog }  from 'hermes-javascript'

export const tts = {
    say: (hermes: Hermes, text: string, siteId: string = 'default') => {
        const dialog = hermes.dialog()
        
        dialog.publish('start_session', {
            init: {
                type: Dialog.enums.initType.notification,
                text
            },
            siteId
        })
    }
}
