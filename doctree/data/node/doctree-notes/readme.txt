node.json

Contains a "title" for the node and a reference to the "resource" which is
the content of this node.

If a node has children, the directory will also contain a .json file for each child - forming a linked list of files.
The first file will be called head.json. If there is more than one file, the last one is called tail.json.

content:
{
    "node": "node-id of first child"
    "next": "next filename (which can be anything as long as its unique in this dir and not node.json"
}
