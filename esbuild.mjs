//@ts-check

import * as esbuild from "esbuild";
import * as ts from "typescript";
import fs from 'node:fs'

await esbuild.build({
  entryPoints: ["src/index.ts"],
  format: "cjs",
  bundle: true,
  outfile: "dist/index.js",
  plugins: [
    {
      name: "fix_bundle_with_namespace_import",
      setup(build) {
        build.onLoad({ filter: /\.ts$/ }, async (args) => {
          let source = await fs.promises.readFile(args.path, 'utf8');
          if(source.includes('export namespace ')) {
            source = ts.transpileModule(source,  {
              compilerOptions: { module: ts.ModuleKind.CommonJS }
            }).outputText;
            return {
              contents: source,
              loader: 'js'
            }
          }
        });
      },
    },
  ],
});
