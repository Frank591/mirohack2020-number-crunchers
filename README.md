# Miro plugin to calculate numbers from text/tags for stickers and cards 

<a href="https://miro.com/oauth/authorize/?response_type=token&client_id=3074457352197060904&redirect_uri=https://miro.com">Direct installation link</a>

## Functions

## Calculate options



There are the following calculate options:

| Option             | Default value | Description |
|--------------------|---------------|-------------|
| calculatedFromText | false         | if true then amounts will be extracted from widget (sticker of card) text. Otherwise, amounts will be extracted from numeric tags |
| whiteList          |               | optional list of available non numeric tags for calculation |
| distributedAmounts | false         | if true then amount will be distributed for all non numeric tags |
| regExp             |               | regular expression used for getting number |
| unitOfMeasure      | SP            | name of unit of measure for numeric values |