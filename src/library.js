class MoreActions {
    static NAMESPACE = "SorenMoreActions"
    static DEBUG = true
    static debug(msg) {
        if (this.DEBUG) {
            console.log(`MoreActions: ${msg}`)
        }
    }
    static onInput() {
        const rootConfig = MysticalSorenUtilities.getState(this.NAMESPACE, {
            config: {
                enabled: true,
                closeQuotations: true,
                doContext: {
                    convertFirstPersonNouns: true,
                    firstLetterCapitalization: true
                },
                sayContext: {
                    convertUnicodePunctuation: true,
                    convertDashToEm: true,
                    interruptionAction: true,
                    questionAction: true,
                    neutralYellAction: true,
                    extremeYellAction: true,
                    emphasisAction: true
                }
            },
            cardId: -1
        })
        if (rootConfig.cardId < 0) {
            const card = addStoryCard("", "", "Class")
            rootConfig.cardId = Number(card.id)
            card.title = "MoreActions Configuration"
            card.description = "Changes Do / Say / Story to be more dynamic."
            card.type = "Class"
            card.keys = ""
            card.entry = JSON.stringify(rootConfig.config, (_, value) => {
                return value
            }, 1)
        } else {
            const cardIdx = MysticalSorenUtilities.getStoryCardIndexById(rootConfig.cardId)
            if (cardIdx > -1) {
                const card = storyCards[cardIdx]
                try {
                    rootConfig.config = JSON.parse(card.entry)
                } catch (error) {
                    this.debug(`Could not parse user json. Possibly user error.\n${error}`)
                }
            } else {
                this.debug("Config card could not be found!")
            }
        }
        const doContext = text.match(/> You (.+)/)
        const sayContext = text.match(/> You say "(.+)"/)
        if (sayContext) {
            let content = sayContext[1]
            if (rootConfig.config.closeQuotations) {
                content = content.replaceAll(/(?<=")[^"\n'`]+(?!.*")/g, (match => { return `${match}"` }))
                content = content.replaceAll(/(?<=')[^'\n"`]+(?!.*')/g, (match => { return `${match}'` }))
                content = content.replaceAll(/(?<=`)[^`\n"']+(?!.*`)/g, (match => { return `${match}\`` }))
            }
            if (rootConfig.config.convertUnicodePunctuation) {
                content.replaceAll(/\u203C/ug, "!!")
                content.replaceAll(/\u203D/ug, (_) => {
                    return MysticalSorenUtilities.randomItem(["?!", "!?"])
                })
                content.replaceAll(/\u2048/ug, "?!")
                content.replaceAll(/\u2049/ug, "!?")
                content.replaceAll(/\u2047/ug, "??")
            }
            if (rootConfig.config.convertDashToEm) {
                content.replaceAll(/\u2014|\u2013|--/ug, "\u{2014}")
            }

            if (rootConfig.config.interruptionAction) {
                let modifiedContent = content.replaceAll(/(?:\u2014|\u2013|--)([!?.]*)$/ug, "\u{2014}$1")
                if (modifiedContent !== content) {
                    text = `> You say "${modifiedContent}," but you were cut off.`
                    content = ""
                }
            }

            if (rootConfig.config.questionAction) {
                if (content.match(/\.\.[!?.]$/)) {
                    const synonyms = ["whisper", "mumble", "quietly say", "mutter", "hesitating say"]
                    text = `> You ${MysticalSorenUtilities.randomItem(synonyms)} "${content}"`
                    content = ""
                }
            }
            if (rootConfig.config.extremeYellAction) {
                if (content.match(/\!\!+$/)) {
                    const synonyms = ["scream", "wail", "shriek", "roar"]
                    text = `> You ${MysticalSorenUtilities.randomItem(synonyms)} "${content}"`
                    content = ""
                }
            }
            if (rootConfig.config.neutralYellAction) {
                if (content.match(/\!$/)) {
                    const synonyms = ["yell", "holler", "call", "shout"]
                    text = `> You ${MysticalSorenUtilities.randomItem(synonyms)} "${content}"`
                    content = ""
                }
            }
            if (rootConfig.config.questionAction) {
                if (content.match(/\?$/)) {
                    const synonyms = ["ask", "question"]
                    text = `> You ${MysticalSorenUtilities.randomItem(synonyms)} "${content}"`
                    content = ""
                }
            }
            if (rootConfig.config.emphasisAction) {
                // TODO
            }
            return { text: text, stop: false }
        }
        if (doContext) {
            if (rootConfig.config.closeQuotations) {
                text = text.replaceAll(/(?<=")[^"\n'`]+(?!.*")/g, (match => { return `${match}"` }))
                text = text.replaceAll(/(?<=')[^'\n"`]+(?!.*')/g, (match => { return `${match}'` }))
                text = text.replaceAll(/(?<=`)[^`\n"']+(?!.*`)/g, (match => { return `${match}\`` }))
            }
            if (rootConfig.config.firstLetterCapitalization) {
                text = text.replaceAll(/([!?.]"?) (\w)/g, (_, g1, g2) => { return `${g1} ${g2.toUpperCase()}` })
            }
            const convertToSecondary = (lowercaseCondition = "", lowercaseReplacement = "") => {
                const regex = new RegExp(`(?<!".*)\b${lowercaseCondition}\b(?!.*")`, "gi")
                const titleCase = lowercaseReplacement.substring(0, 1).toUpperCase() + lowercaseReplacement.substring(1).toLowerCase()
                return text.replaceAll(regex, (match) => {
                    const codePoint = match.codePointAt(0)
                    return codePoint >= 97 && codePoint <= 122 ? lowercaseReplacement.toLowerCase() : titleCase
                })
            }
            if (rootConfig.config.convertFirstPersonNouns) {
                text = convertToSecondary("me", "you")
                text = convertToSecondary("am", "are")
            }
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