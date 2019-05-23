import { Hermes }  from 'hermes-javascript'
import { Enums } from 'hermes-javascript/types'

export const tts = {
    say: (hermes: Hermes, text: string, siteId: string = 'default') => {
        const dialog = hermes.dialog()

        dialog.publish('start_session', {
            init: {
                type: Enums.initType.notification,
                text
            },
            siteId
        })
    }
}
