import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as xml2js from "xml2js";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "dynamic-launch.generateLaunchJson",
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage(
          "No se encuentra una carpeta abierta en el espacio de trabajo."
        );
        return;
      }

      const workspacePath = workspaceFolders[0].uri.fsPath;

      // Buscar archivos .csproj en el directorio actual
      const files = fs
        .readdirSync(workspacePath)
        .filter((file) => file.endsWith(".csproj"));
      if (files.length === 0) {
        vscode.window.showErrorMessage(
          "No se encontró ningún archivo .csproj en el directorio del proyecto."
        );
        return;
      }

      // Permitir al usuario seleccionar un archivo .csproj
      const selectedCsproj = await vscode.window.showQuickPick(files, {
        placeHolder: "Selecciona el archivo .csproj para generar launch.json",
      });

      if (!selectedCsproj) {
        return;
      }

      const csprojPath = path.join(workspacePath, selectedCsproj);

      // Leer y parsear el archivo .csproj
      const data = fs.readFileSync(csprojPath, "utf8");
      xml2js.parseString(data, (err: Error | null, result: any) => {
        if (err) {
          vscode.window.showErrorMessage(
            "Error al parsear el archivo .csproj."
          );
          console.error(err);
          return;
        }

        // Extraer TargetFramework y AssemblyName
        const targetFramework =
          result.Project.PropertyGroup[0].TargetFramework[0];
        const assemblyName = result.Project.PropertyGroup[0].AssemblyName
          ? result.Project.PropertyGroup[0].AssemblyName[0]
          : path.basename(selectedCsproj, ".csproj");

        // Crear el contenido del launch.json
        const launchConfig = {
          version: "0.2.0",
          configurations: [
            {
              name: ".NET Core Launch (web)",
              type: "coreclr",
              request: "launch",
              preLaunchTask: "dotnet: build",
              program: `${"${workspaceFolder}"}/bin/Debug/${targetFramework}/${assemblyName}.dll`,
              args: [],
              cwd: "${workspaceFolder}",
              stopAtEntry: false,
              serverReadyAction: {
                action: "openExternally",
                pattern: "\\bNow listening on:\\s+(https?://\\S+)",
              },
              env: {
                ASPNETCORE_ENVIRONMENT: "Development",
              },
              sourceFileMap: {
                "/Views": "${workspaceFolder}/Views",
              },
              externalConsole: false,
              internalConsoleOptions: "openOnSessionStart",
              pipeTransport: {
                pipeProgram: "cmd",
                pipeArgs: ["/c"],
                debuggerPath: "${env:NETCOREDBG_PATH}netcoredbg.exe",
              },
            },
          ],
        };

        // Escribir el archivo launch.json
        const vscodePath = path.join(workspacePath, ".vscode");
        const launchPath = path.join(vscodePath, "launch.json");

        fs.mkdirSync(vscodePath, { recursive: true });
        fs.writeFileSync(
          launchPath,
          JSON.stringify(launchConfig, null, 4),
          "utf8"
        );

        vscode.window.showInformationMessage(
          "Archivo launch.json generado correctamente en .vscode/"
        );
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
