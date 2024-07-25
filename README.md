# Usage

When developing with `rsbuild`, you can execute the dev command using the following syntax:

```bash  
rsbuild-watch dev -wc/--watch-config file1^fil2^file3
```
By using this feature, you can ensure that your development environment always reflects the latest configuration changes, streamlining your workflow and enhancing productivity.

# Example
When your `rsbuild.config.ts` file needs to be imported from outside, like this:
```bash
├── configs
│   ├── configA.ts
│   └── configB.ts
├── src
└── rsbuild.config.ts
```
```typescript
import configA from './configs/configA';
import configB from './configs/configA';

const config = {
  // your configs
};

export default config;
```
try to use `rsbuild-watch`!
```bash
rsbuild-watch dev -wc/--watch-config ./configs/configA.ts^./configs/configB.ts
```
