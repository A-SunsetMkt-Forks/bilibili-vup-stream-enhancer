import { getSettings, setSettings, sendNotify, checkUpdate, fetchDeveloper } from './utils/messaging'

function getCurrentInput() {
    const setting = {}
    setting.regex = $('#reg-cap')[0].value
    setting.opacity = $('#opacity-jimaku')[0].valueAsNumber
    setting.color = $('#color-jimaku')[0].value
    setting.hideJimakuDanmaku = $('#hide-jimaku-danmaku').prop('checked')
    setting.record = $('#enable-record').prop('checked')
    setting.vtbOnly = $('#vtb-only').prop('checked')
    setting.backgroundSubtitleOpacity = $('#opacity-background')[0].valueAsNumber
    setting.backgroundColor = $('#background-jimaku')[0].value
    setting.subtitleColor = $('#color-subtitle')[0].value
    setting.filterLevel = $('#jimaku-level')[0].valueAsNumber
    const rooms = new Set()
    $('ul#blacklist').children('li').each((i, e) => {
        const room = $(e).attr('room')
        rooms.add(room)
    })
    setting.blacklistRooms = [...rooms]

    const tcmans = new Set()
    $('ul#tongchuan-mans').children('li').each((i, e) => {
        const user = $(e).attr('tc-man-id')
        tcmans.add(user)
    })

    setting.tongchuanMans = [...tcmans]

    const blmans = new Set()
    $('ul#tongchuan-blacklist').children('li').each((i, e) => {
        const user = $(e).attr('bl-man-id')
        blmans.add(user)
    })

    setting.tongchuanBlackList = [...blmans]

    setting.lineGap = $('#line-gap')[0].valueAsNumber
    setting.subtitleSize = $('#subtitle-size')[0].valueAsNumber
    setting.firstSubtitleSize = $('#first-subtitle-size')[0].valueAsNumber
    setting.jimakuAnimation = $('#jimaku-animation')[0].value
    setting.jimakuPosition = $('#jimaku-pos')[0].value

    setting.webSocketSettings = {
        danmakuPosition: $('#danmaku-position')[0].value
    }
    setting.useStreamingTime = $('#use-streaming-time').prop('checked')
    setting.useAsWhitelist = $('#use-whitelist').prop('checked')

    setting.backgroundHeight = $('#height-background')[0].valueAsNumber

    setting.buttonSettings = {
        backgroundListColor: $('#color-button-list-background')[0].value,
        backgroundColor: $('#color-button-background')[0].value,
        textColor: $('#color-button-text')[0].value
    }

    setting.filterCNV = $('#no-cn-v').prop('checked')
    setting.autoCheckUpdate = $('#auto-check-update').prop('checked')
    setting.recordSuperChat = $('#enable-record-sc').prop('checked')
    setting.enableRestart = $('#enable-restart').prop('checked')
    setting.enableJimakuPopup = $('#enable-jimaku-popup').prop('checked')
    setting.enableStreamPopup = $('#enable-stream-popup').prop('checked')
    setting.useLegacy = $('#use-legacy-mode').prop('checked')
    setting.hideBlackList = $('#hide-blacklist').prop('checked')
    setting.hideSettingBtn = $('#hide-setting-btn').prop('checked')
    setting.themeToNormal = $('#theme-to-normal').prop('checked')
    setting.useRemoteCDN = $('#use-remote-cdn').prop('checked')

    setting.developer = {

        elements: {
            upperButtonArea: $('#upper-button-area')[0].value,
            danmakuArea: $('#danmaku-area')[0].value,
            userId: $('#user-id-element')[0].value,
            jimakuArea: $('#jimaku-area')[0].value,
            jimakuFullArea: $('#jimaku-full-area')[0].value,
            videoArea: $('#video-area')[0].value,
            liveTitle: $('#live-title')[0].value,
            chatItems: $('#chat-items')[0].value,
            newMsgButton: $('#new-msg-button')[0].value
        },
        classes: {
            screenFull: $('#full-screen-class')[0].value,
            screenWeb: $('#web-full-screen-class')[0].value
        },
        attr: {
            chatUserId: $('#user-id-attr')[0].value,
            chatDanmaku: $('#danmaku-attr')[0].value
        },
        code: {
            scList: $('#scList-code')[0].value
        }
    }

    return setting
}

function appendBlackList(room) {
    $('ul#blacklist').prepend(`<li class="list-group-item" room="${room}">
            <span>${room}</span>
            <a style="float: right" href="javascript: void(0)" id="${room}">刪除</a>
    </li>`)
    $(`a#${room}`).on('click', () => {
        $('ul#blacklist').children('li').filter((i, e) => $(e).attr('room') == room).each((i, e) => e.remove())
    })
}

$('#blacklist-add-btn').on('click', e => {
    if (!$('#add-blacklist')[0].checkValidity()) {
        return
    }
    e.preventDefault()
    const room = $('#add-blacklist')[0].value
    if (room === undefined || room === '') return
    appendBlackList(room)
    $('#add-blacklist')[0].value = ''
})

function appendTongChuan(user) {
    $('ul#tongchuan-mans').prepend(`<li class="list-group-item" tc-man-id="${user}">
            <span>${user}</span>
            <a style="float: right" href="javascript: void(0)" id="${user}">刪除</a>
    </li>`)
    $(`a#${user}`).on('click', () => {
        $('ul#tongchuan-mans').children('li').filter((i, e) => $(e).attr('tc-man-id') == user).each((i, e) => e.remove())
    })
}

$('#tcman-add-btn').on('click', e => {
    if (!$('#add-tcman')[0].checkValidity()) {
        return
    }
    e.preventDefault()
    const user = $('#add-tcman')[0].value
    if (user === undefined || user === '') return
    appendTongChuan(user)
    $('#add-tcman')[0].value = ''
})

function appendTongChuuanBlackList(user) {
    $('ul#tongchuan-blacklist').prepend(`<li class="list-group-item" bl-man-id="${user}">
            <span>${user}</span>
            <a style="float: right" href="javascript: void(0)" id="${user}">刪除</a>
    </li>`)
    $(`a#${user}`).on('click', () => {
        $('ul#tongchuan-blacklist').children('li').filter((i, e) => $(e).attr('bl-man-id') == user).each((i, e) => e.remove())
    })
}

$('#tcbl-add-btn').on('click', e => {
    if (!$('#add-tcbl')[0].checkValidity()) {
        return
    }
    e.preventDefault()
    const user = $('#add-tcbl')[0].value
    if (user === undefined || user === '') return
    appendTongChuuanBlackList(user)
    $('#add-tcbl')[0].value = ''
})


function saveCurrentInput(setting) {
    $('#reg-cap')[0].value = setting.regex
    $('#opacity-jimaku')[0].valueAsNumber = setting.opacity

    $('#color-jimaku')[0].value = setting.color
    $('#color-jimaku-picker')[0].value = setting.color

    $('#hide-jimaku-danmaku').prop('checked', setting.hideJimakuDanmaku)
    $('#enable-record').prop('checked', setting.record)
    $('#vtb-only').prop('checked', setting.vtbOnly)

    $('#opacity-background')[0].valueAsNumber = setting.backgroundSubtitleOpacity

    $('#background-jimaku')[0].value = setting.backgroundColor
    $('#background-jimaku-picker')[0].value = setting.backgroundColor

    $('#color-subtitle')[0].value = setting.subtitleColor
    $('#color-subtitle-picker')[0].value = setting.subtitleColor

    $('#line-gap')[0].valueAsNumber = setting.lineGap

    $('#subtitle-size')[0].valueAsNumber = setting.subtitleSize
    $('#first-subtitle-size')[0].valueAsNumber = setting.firstSubtitleSize

    for (const room of (setting.blacklistRooms ?? [])) {
        appendBlackList(room)
    }

    for (const user of (setting.tongchuanMans ?? [])) {
        appendTongChuan(user)
    }

    for (const user of (setting.tongchuanBlackList ?? [])){
        appendTongChuuanBlackList(user)
    }

    const { danmakuPosition } = setting.webSocketSettings
    $('#danmaku-position')[0].value = danmakuPosition

    $('#use-streaming-time').prop('checked', setting.useStreamingTime)
    $('label[for=use-streaming-time]')[0].innerText = setting.useStreamingTime ? '使用串流时间戳记' : '使用真实时间戳记'

    $('#use-whitelist').prop('checked', setting.useAsWhitelist)

    $('#height-background')[0].valueAsNumber = setting.backgroundHeight

    const { backgroundListColor, backgroundColor, textColor } = setting.buttonSettings

    $('#color-button-list-background')[0].value = backgroundListColor
    $('#color-button-list-background-picker')[0].value = backgroundListColor

    $('#color-button-background')[0].value = backgroundColor
    $('#color-button-background-picker')[0].value = backgroundColor

    $('#color-button-text')[0].value = textColor
    $('#color-button-text-picker')[0].value = textColor

    $('#no-cn-v').prop('checked', setting.filterCNV)

    $('#jimaku-animation')[0].value = setting.jimakuAnimation
    $('#jimaku-pos')[0].value = setting.jimakuPosition

    $('#auto-check-update').prop('checked', setting.autoCheckUpdate)

    $('#enable-record-sc').prop('checked', setting.recordSuperChat)

    $('#enable-restart').prop('checked', setting.enableRestart)

    $('#enable-jimaku-popup').prop('checked', setting.enableJimakuPopup)
    $('#enable-stream-popup').prop('checked', setting.enableStreamPopup)

    $('#jimaku-level')[0].valueAsNumber = setting.filterLevel

    $('#use-legacy-mode').prop('checked', setting.useLegacy)

    $('#hide-blacklist').prop('checked', setting.hideBlackList)
    $('#hide-setting-btn').prop('checked', setting.hideSettingBtn)

    $('#theme-to-normal').prop('checked', setting.themeToNormal)

    $('#use-remote-cdn').prop('checked', setting.useRemoteCDN)


    const { elements, classes, attr, code } = setting.developer

    // elements
    $('#upper-button-area')[0].value = elements.upperButtonArea
    $('#danmaku-area')[0].value = elements.danmakuArea
    $('#user-id-element')[0].value = elements.userId
    $('#jimaku-area')[0].value = elements.jimakuArea
    $('#jimaku-full-area')[0].value = elements.jimakuFullArea
    $('#video-area')[0].value = elements.videoArea
    $('#live-title')[0].value = elements.liveTitle
    $('#chat-items')[0].value = elements.chatItems
    $('#new-msg-button')[0].value = elements.newMsgButton

    //classes
    $('#full-screen-class')[0].value = classes.screenFull
    $('#web-full-screen-class')[0].value = classes.screenWeb

    //attr
    $('#user-id-attr')[0].value = attr.chatUserId
    $('#danmaku-attr')[0].value = attr.chatDanmaku

    //code
    $('#scList-code')[0].value = code.scList
}



hookColor('color-jimaku')
hookColor('background-jimaku')
hookColor('color-subtitle')
hookColor('color-button-list-background')
hookColor('color-button-background')
hookColor('color-button-text')




$('#save-settings').on('click', async e => {
    const form = $('form#setting')
    if (form[0].checkValidity()) {
        e.preventDefault()
        // disabled while saving
        $(e.target).attr('disabled', true)
        console.log('prepare to save:')
        const set = getCurrentInput()
        console.log(set)
        try {
            await setSettings(set)
            const tabs = await browser.tabs.query({ url: '*://live.bilibili.com/*' })
            const eventTabs = await browser.tabs.query({ url: '*://www.bilibili.com/blackboard/live/*' })
            for (const tab of [...tabs, ...eventTabs]) {
                try {
                    await browser.tabs.sendMessage(tab.id, { cmd: 'restart' })
                }catch(err){
                    console.warn(err)
                }
            }
            await sendNotify({ title: '设置成功', message: '你的设定已成功保存。' })
        } catch (err) {
            console.error(err)
            await sendNotify({ title: '设置失敗', message: err.message })
        } finally {
            setTimeout(() => $(e.target).attr('disabled', false), 5000)
        }
    } else {
        console.log(form.find(":invalid"))
        form.find(":invalid").parents('.collapse').collapse('show')
        sendNotify({ title: '设置失败', message: '请检查是否有缺漏或格式错误。' })
    }
})


$('#clear-data').on('click', async e => {
    e.preventDefault()
    try {
        if (!window.confirm('决定删除所有直播房间的记录?')) return
        const tabs = await browser.tabs.query({ url: '*://live.bilibili.com/*' })
        if (tabs.length > 0) {
            await sendNotify({
                title: '删除失败',
                message: '检测到你有直播房间分页未关闭，请先关闭所有直播房间分页'
            })
        } else {
            const tab = await browser.tabs.create({
                active: false,
                url: 'https://live.bilibili.com'
            })

            await browser.tabs.executeScript(tab.id, {
                code: `
                        for (const db of Object.keys(localStorage).filter(s => s.startsWith('live_room'))){
                            window.indexedDB.deleteDatabase(db)
                        }
                        true
                    `
            })
            await browser.tabs.remove(tab.id)
            await sendNotify({
                title: '删除成功',
                message: '资料库已被清空。'
            })
        }
    } catch (err) {
        console.error(err)
        await sendNotify({
            title: '删除失敗',
            message: err.message
        })
    }
})

$('#use-streaming-time').on('change', e => {
    const s = $(e.target).prop('checked')
    $('label[for=use-streaming-time]')[0].innerText = s ? '使用串流时间戳记' : '使用真实时间戳记'
})

$('#force-alter-way').on('change', e => {
    const s = $(e.target).prop('checked')
    $('label[for=force-alter-way]')[0].innerText = s ? '自动切换到第三方監控' : '询问切换到第三方監控'
})

function hookColor(from) {
    $(`#${from}-picker`).on('change', e => {
        $(`#${from}`)[0].value = e.target.value
    })
}


async function assignValue() {
    const setting = await getSettings()
    console.log(setting)
    saveCurrentInput(setting)
}


$('#fetch-latest-developer').on('click', async e => {
    e.preventDefault()
    if (!window.confirm('这将覆盖开发者相关所有目前设定。')) return
    try {
        const developer = await fetchDeveloper()
        const settings = await getSettings()
        settings.developer = { ...settings.developer,...developer } // override
        await setSettings(settings)
        saveCurrentInput(settings)
        await sendNotify({
            title: '已成功获取最新版本',
            message: '设定档已储存。'
        })
    } catch (err) {
        console.warn(err)
        await sendNotify({
            title: '获取最新版本失败',
            message: err.message ?? err
        })
    }
})

$('#input-setting').on('click', async e => {
    e.preventDefault()
    const files = $('#setting-file')[0].files
    if (files.length == 0) {
        await sendNotify({
            title: '导入失败',
            message: '你未选择你的档案。'
        })
        return
    }
    const json = files[0]
    if (json.type !== 'application/json') {
        await sendNotify({
            title: '导入失败',
            message: '你的档案格式不是json。'
        })
        return
    }
    try {
        const settings = await readAsJson(json)
        await setSettings(settings)
        const newSetting = await getSettings()
        saveCurrentInput(newSetting)
        await sendNotify({
            title: '导入成功',
            message: '你的设定档已成功导入并储存。'
        })
    } catch (err) {
        console.error(err)
        await sendNotify({
            title: '导入失败',
            message: err.message ?? err
        })
    } finally {
        $('#setting-file').val('')
    }
})

$('#output-setting').on('click', async e => {
    e.preventDefault()
    try {
        const set = await getSettings()
        const txt = JSON.stringify(set)
        const a = document.createElement("a");
        const file = new Blob([txt], { type: 'application/json' });
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = `bilibili-jimaku-filter-settings.json`
        a.click();
        URL.revokeObjectURL(url)
        await sendNotify({ title: '导出成功', message: '你的设定档已成功导出。' })
    } catch (err) {
        console.error(err)
        await sendNotify({
            title: '导出失败',
            message: err.message ?? err
        })
    }
})


$('#check-update').on('click', checkUpdate)

async function readAsJson(json) {
    return new Promise((res, rej) => {
        const reader = new FileReader()
        reader.onload = function (e) {
            try {
                res(JSON.parse(e.target.result))
            } catch (err) {
                rej(err)
            }
        }
        reader.onerror = function () {
            rej(reader.error)
        }
        reader.readAsText(json)
    })
}


assignValue().catch(console.error)