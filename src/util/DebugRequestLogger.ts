import {RequestHook} from 'testcafe'

interface RequestEvent {
    requestOptions: RequestOptions
    isAjax: boolean
}

interface RequestOptions {
    headers: Object
    body: Buffer
    url: string
    protocol: string
    hostname: string
    host: string
    port: number
    path: string
    method: string
    credentials: object
    proxy: object
}

export class DebugRequestHook extends RequestHook {

    log = false

    constructor(requestFilterRules: Array<string>, responseEventConfigureOpts: object, log?: boolean) {
        super(requestFilterRules, responseEventConfigureOpts)
        this.log = log
    }

    async onRequest(event: RequestEvent) {
        let cookieHeader = event.requestOptions.headers['cookie'];
        if (cookieHeader === undefined) {
            event.requestOptions.headers['cookie'] = "XDEBUG_TRIGGER="
        } else {
            event.requestOptions.headers['cookie'] = cookieHeader + "; " + "XDEBUG_TRIGGER="
        }

        if (this.log) {
            console.log("${event.requestOptions.method} ${event.requestOptions.url}")
            Object.keys(event.requestOptions.headers).forEach(header => {
                console.log("${header}: ${event.requestOptions.headers[header]}")
            })
        }
    }

    async onResponse(event: object) {
        // noop
    }
}
