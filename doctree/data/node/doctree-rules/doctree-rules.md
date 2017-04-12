# Underlying rules for the doctree structure

```
"node":"root"
```
Always represents the root of the doctree. It's path is always /node/root.

All other nodes will be represented by a directory, Eg: `"node":"doctree-rules"` is one node that references this file.

The subtree of a node is represented by a 'linked-list' of files (one file referencing the next). If a node does have children, the first will be referenced in [node-directory]/head.json.
If there's more than one file, the last item should be called tail.json to aid quick appending.

```
"resource":"./any/file/path.jpeg"
```
A resource reference will be interpreted as a file path relative to the node.json directory.

Implementing code is free to create any directory structure below /node as required.


Eg, If being used for a photo-storage app.

The user wants to upload 5 files.

The app may calculate a hashsum of each file as a node id and then only choose to
upload items not already present. It can then carry forward the paths to all nodes.

It could create a new node under /imports/ to represent the import. It could also
add the imports to a single import-history list that represent every file ever added.

// Tree manipulation could be done 'atomically' preparing new files in a 'changes' directory.
only if all changes are written without error we can begin copying them into the actual directory.
When finished delete the changes directory. No child files should be used while a changes directory exists.
We should attempt to complete the changes first.
