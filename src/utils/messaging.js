import { runtime } from "webextension-polyfill"

export async function getSettings() {
    return sendData({ type: 'get-settings' })
}

export async function sendNotify(data) {
    return sendData({ type: 'notify', data })
}

export async function setSettings(data) {
    return sendData({ type: 'save-settings', data })
}

export async function webRequest(url, timer = undefined) {
    return sendData({ type: 'request', url, timer })
}

export async function checkUpdate() {
    return sendData({ type: 'check-update' })
}

export async function openInspectWindow(roomId, title) {
    return sendData({ type: 'open-window', roomId, title })
}

export async function goToSetting() {
    return sendData({ type: 'go-settings' })
}

export async function getStreamUrls(roomId) {
    return sendData({ type: 'get-stream-urls', roomId })
}

export async function fetchStream(url, callback) {
    return sendData({ type: 'fetch-stream', url, callback })
}

export async function openStreamWindow(roomId, title) {
    return sendData({ type: 'stream-window', roomId, title })
}

export async function startStream(roomId) {
    return sendData({ type: 'stream-start', roomId })
}

export async function sendBackgroundJimaku(data) {
    return sendData({ type: 'jimaku', data })
}

export async function fetchDeveloper() {
    return sendData({ type: 'fetch-developer' })
}

async function sendData(message) {
    return runtime.sendMessage(message)
}
