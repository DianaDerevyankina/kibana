<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-public](./kibana-plugin-public.md) &gt; [LegacyCoreSetup](./kibana-plugin-public.legacycoresetup.md)

## LegacyCoreSetup interface

> Warning: This API is now obsolete.
> 
> 

Setup interface exposed to the legacy platform via the `ui/new_platform` module.

<b>Signature:</b>

```typescript
export interface LegacyCoreSetup extends CoreSetup<any> 
```

## Remarks

Some methods are not supported in the legacy platform and while present to make this type compatibile with [CoreSetup](./kibana-plugin-public.coresetup.md)<!-- -->, unsupported methods will throw exceptions when called.

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [injectedMetadata](./kibana-plugin-public.legacycoresetup.injectedmetadata.md) | <code>InjectedMetadataSetup</code> |  |

