function defValue(rawValue, defaultValue) {
    return typeof rawValue === 'undefined' ? defaultValue : rawValue;
}

function getWidgetText(rawText) {
    var d = document.createElement('div');
    d.innerHTML = rawText;
    return d.innerText;
}

function getNumbersFromWidgetText(widget, tags, settings) {
    var widgetText = getWidgetText(defValue(widget.text, widget.title));
    var widgetAmount = Number(widgetText);
    if (isNaN(widgetAmount)) {
        widgetAmount = 0;
    }
    return {
        amounts: [widgetAmount],
        tagUsed: []
    };
}

function getNumbersFromTags(widget, tags, settings) {
    var amounts = [], tagUsed = [];
    for (var tagNo in tags) {
        var curTagTitle = tags[tagNo].title
        var curTagResult = Number(curTagTitle);
        if (!isNaN(curTagResult)) {
            amounts.push(curTagResult);
            tagUsed.push(tagNo);
        }
    }
    return {
        amounts: amounts,
        tagUsed: tagUsed
    };
}

function getNumbersFromTagsWithRegExp(widget, tags, settings) {
    var regExp = settings.regExp;
    var pattern = new RegExp(regExp);
    var amounts = [], tagUsed = [];
    for (var tagNo in tags) {
        var curTagTitle = tags[tagNo].title
        var matchResult = pattern.exec(curTagTitle);
        if (defValue(matchResult, null) !== null) {
            var curTagResult = Number(matchResult[matchResult.length - 1]);
            if (!isNaN(curTagResult)) {
                amounts.push(curTagResult);
                tagUsed.push(tagNo);
            }
        }
    }
    return {
        amounts: amounts,
        tagUsed: tagUsed
    };
}

function calcWidgetCosts(widget, tags, settings, numbersParser) {
    var hasNoWhiteList = defValue(settings.whiteList, null) === null;
    return numbersParser.then(function (parser) {
        return parser(widget, tags, settings);
    }).then(function (numberParserResult) {
        var result = {
            amount: 0,
            tags: []
        };

        for (var tagNo in tags) {
            if (numberParserResult.tagUsed.indexOf(tagNo) === -1) {
                var curTagTitle = tags[tagNo].title
                var curTagResult = Number(curTagTitle);
                if (isNaN(curTagResult)) {
                    if (hasNoWhiteList) {
                        result.tags.push(curTagTitle);
                    } else {
                        for (var word in settings.whiteList) {
                            if (settings.whiteList[word].toLowerCase() === curTagTitle.toLowerCase()) {
                                result.tags.push(curTagTitle);
                                break;
                            }
                        }
                    }
                }
            }
        }

        // Sort amounts (from bigger to smaller)
        numberParserResult.amounts.sort(function (a, b) {
            return b - a;
        });
        if (numberParserResult.amounts.length > 0) {
            result.amount = numberParserResult.amounts[0];
        }
        return result;
    });
}

function iterationSelection(settings, widgetProcessors, resultProcessor) {
    var result = {
        totalResult: 0,
        groupedResult: {},
        processedWidgets: 0,
        totalWidgets: 0,
        unitOfMeasure: defValue(settings.unitOfMeasure, 'SP')
    };

    var selectionPromise = miro.board.selection.get();
    selectionPromise.then(function (foundWidgets) {
        var widgetCount = foundWidgets.length;
        var processResult = result;
        var resultPromises = [];
        for (var widgetNo = 0; widgetNo < widgetCount; widgetNo++) {
            processResult.totalWidgets++;
            var currentWidget = foundWidgets[widgetNo];
            var curWidgetProcessor = widgetProcessors[currentWidget.type];
            if (typeof curWidgetProcessor !== 'undefined') {
                var tags = currentWidget.tags;
                resultPromises.push(curWidgetProcessor(currentWidget, tags, processResult, settings));
                processResult.processedWidgets++;
            }
        }
        Promise.all(resultPromises).then(function () {
            resultProcessor(processResult);
        });
    }, function () {
        console.log('Errors:', arguments);
    });
}

function getNumbersParser(settings) {
    var parser = null;
    if (defValue(settings.calculatedFromText, false)) {
        parser = getNumbersFromWidgetText;
    } else if (defValue(settings.regExp, null) !== null) {
        parser = getNumbersFromTagsWithRegExp;
    } else {
        parser = getNumbersFromTags;
    }
    return new Promise(function (resolve, reject) {
        if (parser !== null) {
            return resolve(parser);
        }
        return reject("Error");
    });
}

function groupValueProcessor(result, amount, settings, tagName, tagCount) {
    var tagAmount = defValue(result.groupedResult[tagName], 0);
    if (defValue(settings.distributedAmounts, false)) {
        tagAmount += (amount / tagCount);
    } else {
        tagAmount += (amount);
    }
    result.groupedResult[tagName] = tagAmount;
}

function stickerProcessor(widget, tags, result, settings) {
    return calcWidgetCosts(widget, tags, settings, getNumbersParser(settings))
        .then(function (widgetCost) {
            result.totalResult += widgetCost.amount;
            var tagCount = widgetCost.tags.length;
            if (tagCount > 0) {
                for (var tagNo in widgetCost.tags) {
                    var tagName = widgetCost.tags[tagNo];
                    groupValueProcessor(result, widgetCost.amount, settings, tagName, tagCount);
                }
            } else {
                groupValueProcessor(result, widgetCost.amount, settings, 'No group', 1);
            }
        });
}

function cardProcessor(widget, tags, result, settings) {
    // Now calculation is the same for cards and stickers
    return stickerProcessor(widget, tags, result, settings);
}