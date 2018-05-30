<a name="module_r-spacex/rocketsass"></a>

## r-spacex/rocketsass
A smart sass compiler


* [r-spacex/rocketsass](#module_r-spacex/rocketsass)
    * _static_
        * [.OutputStyle](#module_r-spacex/rocketsass.OutputStyle) : <code>enum</code>
        * [.readConfig(filepath, callback)](#module_r-spacex/rocketsass.readConfig)
        * [.getAllConfigs(path, files, callback)](#module_r-spacex/rocketsass.getAllConfigs) ⇒ <code>Array.&lt;object&gt;</code>
        * [.compile(paths, options, logger)](#module_r-spacex/rocketsass.compile)
    * _inner_
        * [~configCallback](#module_r-spacex/rocketsass..configCallback) : <code>function</code>
        * [~CompileOptions](#module_r-spacex/rocketsass..CompileOptions)

<a name="module_r-spacex/rocketsass.OutputStyle"></a>

### r-spacex/rocketsass.OutputStyle : <code>enum</code>
Enum for Sass compilation output styles.

**Kind**: static enum of [<code>r-spacex/rocketsass</code>](#module_r-spacex/rocketsass)  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| NESTED | <code>OutputStyle</code> | <code>nested</code> | Sass's nested output style (the default) |
| EXPANDED | <code>OutputStyle</code> | <code>expanded</code> | Sass's expanded output style |
| COMPACT | <code>OutputStyle</code> | <code>compact</code> | Sass's compact output style |
| COMPRESSED | <code>OutputStyle</code> | <code>compressed</code> | Sass's compressed output style |

<a name="module_r-spacex/rocketsass.readConfig"></a>

### r-spacex/rocketsass.readConfig(filepath, callback)
Reads a configuration from the header of a CSS file.

**Kind**: static method of [<code>r-spacex/rocketsass</code>](#module_r-spacex/rocketsass)  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | The path to the file to be read from. |
| callback | <code>configCallback</code> | The callback that handles the read configuration. |

<a name="module_r-spacex/rocketsass.getAllConfigs"></a>

### r-spacex/rocketsass.getAllConfigs(path, files, callback) ⇒ <code>Array.&lt;object&gt;</code>
Takes a list of files and reads configs from them

**Kind**: static method of [<code>r-spacex/rocketsass</code>](#module_r-spacex/rocketsass)  
**Returns**: <code>Array.&lt;object&gt;</code> - An array of all the configurations for each file.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path where the files to read configs from are stored |
| files | <code>Array.&lt;string&gt;</code> | The list of file names to compile |
| callback | <code>function</code> | Callback called with error and array of configs |

<a name="module_r-spacex/rocketsass.compile"></a>

### r-spacex/rocketsass.compile(paths, options, logger)
Compiles sass files from a directory to targets using config headers

**Kind**: static method of [<code>r-spacex/rocketsass</code>](#module_r-spacex/rocketsass)  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | An array of paths to the directory where Sass files are stored |
| options | <code>CompileOptions</code> | Compilation options |
| logger | <code>Console</code> | The output to log items, e.g. `console` |

<a name="module_r-spacex/rocketsass..configCallback"></a>

### r-spacex/rocketsass~configCallback : <code>function</code>
**Kind**: inner typedef of [<code>r-spacex/rocketsass</code>](#module_r-spacex/rocketsass)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error thrown, if any. |
| config | <code>Object</code> | The config object if read succesfully |

<a name="module_r-spacex/rocketsass..CompileOptions"></a>

### r-spacex/rocketsass~CompileOptions
**Kind**: inner typedef of [<code>r-spacex/rocketsass</code>](#module_r-spacex/rocketsass)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ignorePrefix | <code>string</code> | If the filename starts with this, do not compile. |
| style | <code>OutputStyle</code> | The default style for the CSS output |
| projectDir | <code>string</code> | The project root directory |

