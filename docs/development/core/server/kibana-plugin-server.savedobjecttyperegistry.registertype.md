<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-server](./kibana-plugin-server.md) &gt; [SavedObjectTypeRegistry](./kibana-plugin-server.savedobjecttyperegistry.md) &gt; [registerType](./kibana-plugin-server.savedobjecttyperegistry.registertype.md)

## SavedObjectTypeRegistry.registerType() method

Register a [type](./kibana-plugin-server.savedobjectstype.md) inside the registry. A type can only be registered once. subsequent calls with the same type name will throw an error.

<b>Signature:</b>

```typescript
registerType(type: SavedObjectsType): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  type | <code>SavedObjectsType</code> |  |

<b>Returns:</b>

`void`

