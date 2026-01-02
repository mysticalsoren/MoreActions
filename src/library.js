class MoreActions {
    static DEBUG = true
    static debug(msg) {
        if (this.DEBUG) {
            console.log(`MoreActions: ${msg}`)
        }
    }
    static onInput() {
        const doContext = text.match(/> You (.+)/)
        const sayContext = text.match(/> You say "(.+)"/)
        if (sayContext) {
            let content = sayContext[1]
            content.replaceAll(/\u203C/ug, "!!")
            content.replaceAll(/\u203D/ug, (_) => {
                return MysticalSorenUtilities.randomItem(["?!", "!?"])
            })
            content.replaceAll(/\u2048/ug, "?!")
            content.replaceAll(/\u2049/ug, "!?")
            content.replaceAll(/\u2047/ug, "??")


            let modifiedContent = content.replaceAll(/(?:\u2014|\u2013|--)([!?.]*)$/ug, "\u{2014}$1")
            if (modifiedContent !== content) {
                text = `> You say "${modifiedContent}," but you were cut off.`
                content = ""
            }
            if (content.match(/\.\.[!?.]$/)) {
                const synonyms = ["whisper", "mumble", "quietly say", "mutter", "hesitating say"]
                text = `> You ${MysticalSorenUtilities.randomItem(synonyms)} "${content}"`
                content = ""
            }
            if (content.match(/\!\!+$/)) {
                const synonyms = ["scream", "wail", "shriek", "roar"]
                text = `> You ${MysticalSorenUtilities.randomItem(synonyms)} "${content}"`
                content = ""
            }
            if (content.match(/\!$/)) {
                const synonyms = ["yell", "holler", "call", "shout"]
                text = `> You ${MysticalSorenUtilities.randomItem(synonyms)} "${content}"`
                content = ""
            }
            if (content.match(/\?$/)) {
                const synonyms = ["ask", "question"]
                text = `> You ${MysticalSorenUtilities.randomItem(synonyms)} "${content}"`
                content = ""
            }
            return { text: text, stop: false }
        }
        if (doContext) {
            text = text.replaceAll(/([!?.]) (\w)/g, (_, g1, g2) => { return `${g1} ${g2.toUpperCase()}` })
            text = text.replaceAll(/\bme\b/gi, (match) => {
                return match.codePointAt(0) === 109 ? "you" : "You"
            })
            text = text.replaceAll(/\bam\b/gi, (match) => {
                return match.codePointAt(0) === 97 ? "are" : "Are"
            })
            return { text: text, stop: false }
        }
        return { text: text, stop: false }
    }
    static run(runContext) {
        if (typeof runContext != "string") {
            this.debug("runContext is not a string!")
            return { text: text, stop: true }
        }
        switch (runContext.toLowerCase()) {
            case "input":
                return this.onInput()
            case "context":
                this.debug('Unimplemented runContext "context"')
                return { text: text, stop: false }
                break
            case "output":
                this.debug('Unimplemented runContext "output"')
                return { text: text, stop: false }
                break
            default:
                this.debug(`Invalid runContext "${runContext}"`)
        }
        return { text: text, stop: true }
    }
}