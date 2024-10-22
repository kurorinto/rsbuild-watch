import { loadConfig, logger, createRsbuild } from "@rsbuild/core";
import { Command, program } from "commander";
import pkg from "../package.json" assert { type: "json" };
import { watch } from "chokidar";
import pc from "picocolors";

interface DevCommandOptions {
  config?: string;
  envDir?: string;
  envMode?: string;
  open?: boolean | string;
  host?: string;
  port?: number;
  watchConfig?: string;
}

const applyCommonOptions = (command: Command) => {
  command
    .option(
      "-wc --watch-config <watch-config>",
      "specifies the configuration file to listen to, if there are more than one, they can be separated by ^",
    )
    .option(
      "-c --config <config>",
      "specify the configuration file, can be a relative or absolute path",
    )
    .option("--env-mode <mode>", "specify the env mode to load the `.env.[mode]` file")
    .option("--env-dir <dir>", "specify the directory to load `.env` files");
};

const applyServerOptions = (command: Command) => {
  command
    .option("-o --open [url]", "open the page in browser on startup")
    .option("--port <port>", "specify a port number for server to listen")
    .option("--host <host>", "specify the host that the server listens to");
};

const runRsbuildDevServer = async (options: Parameters<typeof loadConfig>[0]) => {
  // 获取配置
  const { content: rsbuildConfig, filePath } = await loadConfig(options);
  // 创建rsbuild实例
  const rsbuild = await createRsbuild({
    cwd: options.cwd,
    rsbuildConfig,
  });
  const devServer = await rsbuild.startDevServer();

  return { rsbuild, devServer, filePath };
};

export function run() {
  program.name("rsbuild-watch").usage("<command> [options]");
  program.version(pkg.version);

  const devCommander = program.command("dev");

  applyCommonOptions(devCommander);
  applyServerOptions(devCommander);

  devCommander.action(async (options: DevCommandOptions) => {
    let { devServer } = await runRsbuildDevServer({
      cwd: process.cwd(),
      path: options.config,
      envMode: options.envMode,
    });

    // 监听配置文件
    if (options.watchConfig) {
      const watcher = watch(options.watchConfig.split("^"), {
        persistent: true,
        ignoreInitial: true,
      });
      watcher.on("change", async (path) => {
        const tempPath = path.split("/");
        const fileName = tempPath[tempPath.length - 1];
        logger.info(`${pc.green(`Restart because ${pc.yellow(fileName)} is changed.`)}\n`);

        devServer.server.close();
        ({ devServer } = await runRsbuildDevServer({
          cwd: process.cwd(),
          path: options.config,
          envMode: options.envMode,
        }));
      });
    }
  });

  program.parse();
}
