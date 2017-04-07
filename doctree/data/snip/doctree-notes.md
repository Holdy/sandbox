# Introduction

A doctree is a set of content 'snippets' held in a tree structure. Any sub-tree can be reused elsewhere and any piece of content can appear in multiple places.

The main purpose of this is to allow creation of multiple documents / resources that can share 'snippets' or whole sections.

# Structure

The doctree structure has two top level directories.

`/snip`
    This is a 'flat' directory with each content snippet in it's own file.

`/node`
    Similar to /snip, this is also a flat directory containing every node in the tree as a directory.
    Each node directory references its content with a nodename.snip symlink.
    A node directory can also contain a nodename.node file, each line of which references a child node, thus building a tree.

The root of the tree is /node/root
The root node will not contain a .snip file but can contain a root.node file specifying the top level sub-trees.
