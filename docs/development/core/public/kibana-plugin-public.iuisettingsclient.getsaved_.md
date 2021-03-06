<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-public](./kibana-plugin-public.md) &gt; [IUiSettingsClient](./kibana-plugin-public.iuisettingsclient.md) &gt; [getSaved$](./kibana-plugin-public.iuisettingsclient.getsaved_.md)

## IUiSettingsClient.getSaved$ property

Returns an Observable that notifies subscribers of each update to the uiSettings, including the key, newValue, and oldValue of the setting that changed.

<b>Signature:</b>

```typescript
getSaved$: <T = any>() => Observable<{
        key: string;
        newValue: T;
        oldValue: T;
    }>;
```
