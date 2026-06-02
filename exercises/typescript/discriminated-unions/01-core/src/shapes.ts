// exercises/typescript/discriminated-unions/01-core/src/shapes.ts

export type Circle = { kind: 'circle'; radius: number };
export type Square = { kind: 'square'; side: number };
export type Rectangle = { kind: 'rectangle'; w: number; h: number };

export type Shape = Circle | Square | Rectangle;

export function getArea(s: Shape): number {
  switch (s.kind) {
    case 'circle':
      return Math.PI * s.radius ** 2;
    case 'square':
      return s.side ** 2;
    case 'rectangle':
      return s.w * s.h;
    default:
      return assertNever(s);
  }
}

export function describeShape(s: Shape): string {
  switch (s.kind) {
    case 'circle':
      return `circle(${s.radius})`;
    case 'square':
      return `square(${s.side})`;
    case 'rectangle':
      return `rect(${s.w}x${s.h})`;
    default:
      return assertNever(s);
  }
}

export function assertNever(x: never): never {
  throw new Error(`unreachable: ${x}`);
}
