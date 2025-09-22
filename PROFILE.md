# GDELT Documentation

All there is to know about using GDELT.

You'll find all of GDELT's documentation in this section, from user manuals to codebooks, lookup files to normalization spreadsheets.

## GDELT 1.0 Event Database

The following documentation describes the GDELT 1.0 Event Database, its major data fields and their descriptions and formats, and the codebook for the CAMEO event taxonomy. Remember that GDELT 1.0 only updates daily and does NOT include events reported in the 65 live translated languages.

- [GDELT 1.0 Data Format Documentation](#gdelt-10-data-format)
- [CAMEO Code Reference](#cameo-code-reference)
- [ISA 2013 Paper Introducing GDELT](#isa-2013-paper)
- [GDELT 1.0 Column Labels Header Row 1979 - March 2013](#gdelt-10-columns-legacy)
- [GDELT 1.0 Column Labels Header Row April 1, 2013 - Present](#gdelt-10-columns-current)
- [GDELT 1.0 Column Labels With Their Column IDs](#gdelt-10-column-ids)

## GDELT 2.0 Event Database

GDELT 2.0 adds a wealth of new features to the event database and includes events reported in articles published in the 65 live translated languages. The core event table is largely the same with a few additional columns, but there is a new "mentions" table and several other changes and the data updates every 15 minutes.

- [GDELT 2.0 Documentation](#gdelt-20-documentation)

## GDELT 1.0 GKG

The following documentation describes the GDELT 1.0 Global Knowledge Graph (GKG), its major data fields and their descriptions and formats. Remember that GDELT 1.0 only updates daily and does NOT include coverage from the 65 live translated languages.

- [Data Format Documentation](#gkg-10-format)

## GDELT 2.0 GKG

GDELT 2.0's Global Knowledge Graph (GKG) adds a vast wealth of new features, incorporates the 65 live translated languages and updates every 15 minutes.

- [GDELT 2.0 Documentation](#gdelt-20-gkg-documentation)

## GDELT Visual GKG 1.0

The GDELT Visual Knowledge Graph applies Google's most powerful deep learning algorithms to global news imagery in order to catalog the visual narratives of the world's media in realtime.

- [GDELT Visual GKG Documentation](#visual-gkg-documentation)

## GDELT 2.0 GKG Special Collections

In addition to the news-based Global Knowledge Graph (GKG) updated every 15 minutes and based on global news reporting, there are numerous special GKG collections available that focus on specific specialized sources of information or topics, from 21 billion words of academic literature to 215 years of books.

- [GDELT 2.0 GKG Special Collections Documentation](#special-collections-documentation)

## EVENT CAMEO Actor Code Lookups

The GDELT 1.0 and 2.0 Event Databases use the CAMEO event taxonomy, which records the actors involved in an event as a series of 3-character codes. These tab-delimited lookup files contain the human-friendly textual labels for each of those codes to make it easier to work with the data for those who have not previously worked with CAMEO. Remember that CAMEO Country Codes are only used in the "Actor" fields, while FIPS Country Codes are used in the "Geo" fields.

### Actor Code Reference Files:
- [CAMEO Country Codes / FIPS GEO Country Codes](#cameo-country-codes)
- [CAMEO Type Codes](#cameo-type-codes)
- [CAMEO Known Group Codes](#cameo-group-codes)
- [CAMEO Ethnic Codes](#cameo-ethnic-codes)
- [CAMEO Religion Codes](#cameo-religion-codes)

## EVENT CAMEO Event Code Lookups

The GDELT 1.0 and 2.0 Event Databases use the CAMEO event taxonomy, which is a collection of more than 300 types of events organized into a hierarchical taxonomy and recorded in the files as a numeric code. These tab-delimited lookup files contain the human-friendly textual labels for each of those codes to make it easier to work with the data for those who have not previously worked with CAMEO.

### Event Code Reference Files:
- [CAMEO Event Codes](#cameo-event-codes)
- [CAMEO Goldstein Scale](#cameo-goldstein-scale)

## GDELT 1.0 Event Database Normalization Files

The comma-delimited (CSV) files below are updated daily and record the total number of events in the GDELT 1.0 Event Database across all event types broken down by time and country. This is important for normalization tasks, to compensate the exponential increase in the availability of global news material over time. Due to GDELT 2.0's live updating, we do not currently make normalization files available for GDELT 2.0, but you can easily construct your own normalization files by performing a basic summation over the 15 minute update files.

### Normalization Files:
- [Daily](#daily-normalization)
- [Daily by Country](#daily-country-normalization)
- [Monthly](#monthly-normalization)
- [Monthly by Country](#monthly-country-normalization)
- [Yearly](#yearly-normalization)
- [Yearly by Country](#yearly-country-normalization)

## Getting Started with GDELT

GDELT is the largest, highest resolution, and most detailed open dataset of global human society ever created. This means that working with it can require a lot of careful attention to things like normalization that are often unfamiliar to many disciplines. Later this year we will be releasing a "Getting Started With GDELT" guide to walk you through how to work with the breathtakingly massive look at global society that is GDELT. For now, keep a close eye on the GDELT Blog, where we post regular tutorials, examples and updates.

### Resources:
- [The GDELT Blog](#gdelt-blog)

---

*This documentation provides comprehensive information about all GDELT databases, formats, and reference materials to help researchers and developers work effectively with the GDELT dataset.*