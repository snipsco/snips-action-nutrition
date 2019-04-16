import { Hermes, Dialog }  from 'hermes-javascript'

export const tts = {
    say: (text: string, siteId: string = 'default') => {
        const hermes = new Hermes()
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
