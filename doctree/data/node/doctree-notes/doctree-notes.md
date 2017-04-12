# Introduction

A doctree is a set of content 'snippets' held in a tree structure. Any sub-tree can be reused elsewhere and any piece of content can appear in multiple places.

The main purpose of this is to allow creation of multiple documents / resources that can share 'snippets' or whole sections.

# Structure

The doctree structure has a single top level directory.


`/node`
    This is a flat directory containing every node in the tree as a json file.
    A nodes file references the locatiom of its content via a 'resource' property.

The root of the tree is /node/root.json. This file should not contain a 'resource' property, but should contain a head.json file, specifying the top level sub-trees of this doctree.



