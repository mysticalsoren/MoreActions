# MoreActions
Modifes the user's input based on context. Also converts some words to second-person words like "me" to "you"

# Configuration
* `closeQuotations`: Closes single and double quotations marks as well as accent marks.
* `convertFirstPersonNouns`: Automatically convert first person nouns like "me" to "you"
* `firstLetterCapitalization`: Capitalizes the first letter after a period, question mark, or exclamation mark.
* `convertUnicodePunctuation`: Converts unicode symbols like "⁇" to "??"
* `convertDashToEm`: Converts "--" or a en dash to use a em dash.
* `interruptionAction`: Whether to change the default say input with "\<...\> **but you were cut off.**"
* `questionAction`: Whether to change the default say input with "You **asked** '...'"
* `neutralYellAction`: Whether to change the default say input with "You **yell** '...'"
* `extremeYellAction`: Whether to change the default say input with "You **scream** '...'"
* `emphasisAction`: Whether to change the default say input with {unimplemented}