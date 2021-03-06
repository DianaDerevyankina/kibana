<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-server](./kibana-plugin-server.md) &gt; [SavedObjectsRepositoryFactory](./kibana-plugin-server.savedobjectsrepositoryfactory.md)

## SavedObjectsRepositoryFactory interface

Factory provided when invoking a [client factory provider](./kibana-plugin-server.savedobjectsclientfactoryprovider.md) See [SavedObjectsServiceSetup.setClientFactoryProvider](./kibana-plugin-server.savedobjectsservicesetup.setclientfactoryprovider.md)

<b>Signature:</b>

```typescript
export interface SavedObjectsRepositoryFactory 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [createInternalRepository](./kibana-plugin-server.savedobjectsrepositoryfactory.createinternalrepository.md) | <code>(extraTypes?: string[]) =&gt; ISavedObjectsRepository</code> | Creates a [Saved Objects repository](./kibana-plugin-server.isavedobjectsrepository.md) that uses the internal Kibana user for authenticating with Elasticsearch. |
|  [createScopedRepository](./kibana-plugin-server.savedobjectsrepositoryfactory.createscopedrepository.md) | <code>(req: KibanaRequest, extraTypes?: string[]) =&gt; ISavedObjectsRepository</code> | Creates a [Saved Objects repository](./kibana-plugin-server.isavedobjectsrepository.md) that uses the credentials from the passed in request to authenticate with Elasticsearch. |

