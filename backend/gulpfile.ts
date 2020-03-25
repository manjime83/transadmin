import { src, dest } from "gulp";
import * as ts from "gulp-typescript";

export function zip() {
  return src("functions/**/*ts");
}

export function build() {
  return src("functions/**/*ts").pipe(ts()).pipe(dest("build2"));
}
