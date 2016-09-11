LDiff
========================
LDiff shows the differences between two documents. It is intended primarily for legislative documents (e.g. amended bills and regulations, updated compilations or codes). 

## Quick Start
Try it out [here](https://xcential.github.io/LDiff/index.html). The initial demo shows two versions of a U.S. House bill. The first two tabs show the two bills, HR766 as 'introduced' in the House, and HR766 as 'reported' in the House. The third tab shows the differences between the two bills and the fourth tab shows the differences in the underlying XML of the bill documents. Replace these samples to compare your own documents.

### Upload documents
There are three ways to upload documents to compare:

1.  Click on the buttons at the top right to upload documents from your local filesystem. The left button loads the first tab and the right button loads the second tab.
2.  Drag and drop a file from your filesystem onto one of the two buttons.
3.  Click on the 'edit' icon on one of the first two tabs to copy and paste your text into a new input area. Note that you can paste or type plain text or structured text (html/xml) to compare.

### Comparisons
Two kinds of comparisons are shown, 'Structural' comparisons, which retain the xml structure of the documents, and display the comparison in html. This does _not_ compare structural or styling elements, but strips them before comparing the text, and then attempts to restore the structure to the final document. As a result, this 'structural' comparison may not accurately show changes in the underlying elements. For example, comparing ```this is <bold>bold</bold>``` to ```this is <italic>italic</italic>``` will show the changed word in both bold and italic. By contrast, the Text comparison compares all input as plain text.

## Technical Overview
This application uses the [Google diff-match-patch algorithm](https://code.google.com/p/google-diff-match-patch/) to calculate differences between documents. The javascript version of the algorithm was wrapped in an [AngularJS](https://angular.io/) directive in https://github.com/amweiss/angular-diff-match-patch. The current application also uses an [angular-rich-text](https://github.com/bill-long/angular-rich-text-diff.git) directive to compare xml or html documents and retain their structure.
No data is sent to the server: the comparisons are done in javascript, entirely in your local browser. As a result, comparison of large documents may be slow and may cause your browser to crash. For very large documents (e.g. hundreds of pages), it is probably better to run a comparison algorithm in Python or C.

## Dependencies

## Installation
