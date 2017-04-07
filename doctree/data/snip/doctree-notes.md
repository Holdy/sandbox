# Introduction

A doctree is a set of content 'snippets' held in a tree structure. Any part of the tree can be reused elsewhere and any piece of content can appear in multiple places.

The main purpose of this is to allow creation of multiple documents / resources that can share 'snippets' or whole sections.

# Structure

The doctree structure has three top level directories.

/snip
    This is a 'flat' directory with each content snippet in it's own file.

/node
    Similar to /snip, this is also a flat directory containing every node in the tree as a directory.
    However, these directories can contain simlinks to other directories thus building a tree.
    Each node directory references its content with a nodename.snip symlink.

/root
    This directory represents the root of the tree and it contains the top level nodes (in the form simlinks to directories in /node).
