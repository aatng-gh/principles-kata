import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';
import {
  type Circle,
  type Rectangle,
  type Shape,
  type Square,
  assertNever,
  describeShape,
  getArea,
} from '../src/shapes';

describe('Discriminated Unions 01 - Shapes (core)', () => {
  it('calculates area correctly for all variants (runtime)', () => {
    const c: Circle = { kind: 'circle', radius: 2 };
    const s: Square = { kind: 'square', side: 3 };
    const r: Rectangle = { kind: 'rectangle', w: 4, h: 5 };

    expect(getArea(c)).toBeCloseTo(Math.PI * 4);
    expect(getArea(s)).toBe(9);
    expect(getArea(r)).toBe(20);
  });

  it('narrows correctly via discriminant (type level)', () => {
    const shape: Shape = { kind: 'circle', radius: 1 } as const;

    if (shape.kind === 'circle') {
      expectTypeOf(shape.radius).toEqualTypeOf<number>();
      // @ts-expect-error square does not exist on circle
      shape.side;
    }
  });

  it('describe produces reasonable strings', () => {
    expect(describeShape({ kind: 'square', side: 1 })).toContain('square');
  });

  it('exhaustiveness helper + adding variant would be caught (simulated via @ts-expect)', () => {
    function areaExhaustive(s: Shape): number {
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

    expect(areaExhaustive({ kind: 'circle', radius: 1 })).toBeCloseTo(Math.PI);

    // To prove exhaustiveness in the type system, the test also has a "would fail to compile if new variant"
    // We simulate by checking that a bad shape doesn't type as Shape
    // @ts-expect-error - triangle not a member of the Shape union
    const bad: Shape = { kind: 'triangle', radius: 1 };
  });
});
