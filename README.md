# Generar launch.json Dinámico

Esta extensión para Visual Studio Code facilita la creación de un archivo launch.json dinámico basado en un archivo .csproj. Ideal para proyectos .NET Core, permite generar automáticamente las configuraciones de depuración sin necesidad de configurarlas manualmente.

## Características

Lee automáticamente el archivo .csproj en el directorio del proyecto.
Extrae el framework de destino (TargetFramework) y el nombre del ensamblado (AssemblyName) desde el archivo .csproj.
Genera un archivo launch.json en la carpeta .vscode con la configuración necesaria para depurar tu proyecto .NET Core.
Te permite seleccionar el archivo .csproj si hay múltiples opciones en tu proyecto.

## Requisitos

Visual Studio Code instalado.

Un proyecto .NET Core con un archivo .csproj válido.

netcoredbg instalado, un depurador para .NET Core. Puedes encontrarlo en el repositorio oficial de Samsung: https://github.com/Samsung/netcoredbg.

### Instalación de netcoredbg

Ve al repositorio oficial.
Descarga la versión más reciente del depurador para tu sistema operativo.
Extrae los archivos en un directorio de tu elección.
Configura la variable de entorno NETCOREDBG_PATH apuntando al directorio donde se encuentra netcoredbg.exe.
Ejemplo en Windows (PowerShell):

```powershell
$env:NETCOREDBG_PATH="C:\ruta\al\directorio\netcoredbg\"
```

Ejemplo en Linux/MacOS:

```bash
export NETCOREDBG_PATH=/ruta/al/directorio/netcoredbg/
```

### Instalación de la extensión

#### Cómo usar

Abre tu proyecto en Visual Studio Code.
Presiona Ctrl+Shift+P (o Cmd+Shift+P en macOS) para abrir la Paleta de Comandos.
Busca el comando Generar launch.json dinámico y ejecútalo.
Selecciona el archivo .csproj de tu proyecto (si es necesario).
La extensión generará automáticamente el archivo launch.json en la carpeta .vscode.
Configuración
No se requiere configuración adicional. La extensión detecta automáticamente el archivo .csproj en el directorio raíz del proyecto. Asegúrate de que la variable NETCOREDBG_PATH esté configurada correctamente para que el depurador funcione.

Ejemplo de Uso
Imagina que tienes un archivo .csproj como el siguiente:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <AssemblyName>MyApp</AssemblyName>
  </PropertyGroup>
</Project>
```

La extensión generará un archivo launch.json similar a este:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "dotnet: build",
      "program": "${workspaceFolder}/bin/Debug/net6.0/MyApp.dll",
      "args": [],
      "cwd": "${workspaceFolder}",
      "stopAtEntry": false,
      "serverReadyAction": {
        "action": "openExternally",
        "pattern": "\\bNow listening on:\\s+(https?://\\S+)"
      },
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "sourceFileMap": {
        "/Views": "${workspaceFolder}/Views"
      },
      "externalConsole": false,
      "internalConsoleOptions": "openOnSessionStart",
      "pipeTransport": {
        "pipeProgram": "cmd",
        "pipeArgs": ["/c"],
        "debuggerPath": "${env:NETCOREDBG_PATH}netcoredbg.exe"
      }
    }
  ]
}
```

Este archivo estará listo para usar en tu entorno de depuración.

## Contribuir

Si deseas mejorar esta extensión o reportar errores, puedes crear un pull request o abrir un issue en el repositorio.

## Licencia

Esta extensión se distribuye bajo la licencia MIT.
