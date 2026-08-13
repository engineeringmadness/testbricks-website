# testbricks-website

Build a website for my Python library testbricks. This library helps to run Databricks workflows seamlessly on a local machine. The library implements powerful mocks for standard Databricks functionalities like a SparkProxy which routes delta table reads & writes to CSV files, a drop in replacement for dbutils object. A workflow runner that parses a Databricks workflow JSON and executes the notebooks in order of dependencies. Keep a chill vibe

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f157ef6f-0ce4-4bfd-8f95-34a83a9481a4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
