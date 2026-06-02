// exercises/typescript/discriminated-unions/01-core/src/shapes.ts
// Proper discriminated union using unique literal discriminants.
// Switch + assertNever gives compile-time exhaustiveness.
// The same Shape type and handlers are used from class methods or pure fns.

export interface Circle {
  kind: 'circle';
  radius: number;
}

export interface Square {
  kind: 'square';
  side: number;
}

export interface Rectangle {
  kind: 'rectangle';
  w: number;
  h: number;
}

export type Shape = Circle | Square | Rectangle;

export function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side ** 2;
    case 'rectangle':
      return shape.w * shape.h;
  }
}

export function describe(shape: Shape): string {
  switch (shape.kind) {
    case 'circle':
      return `circle r=${shape.radius}`;
    case 'square':
      return `square s=${shape.side}`;
    case 'rectangle':
      return `rect ${shape.w}x${shape.h}`;
  }
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${JSON.stringify(x)}`);
}
