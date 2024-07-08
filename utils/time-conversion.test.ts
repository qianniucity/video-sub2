import { DT } from './time-conversion';

describe('Time Conversion Tests', () => {
    test('d2t converts duration to time string correctly', () => {
        expect(DT.d2t(3661.100)).toBe('01:01:01.100');
    });
    test('d2t converts duration to time string correctly', () => {
        expect(DT.d2t(61.111)).toBe('00:01:01.111');
    });

    test('d2t converts duration to time string correctly', () => {
        expect(DT.d2t(3661.000)).toBe('01:01:01.000');
    });

    test('t2d converts time string to duration correctly', () => {
        expect(DT.t2d('01:01:01.100')).toBe(3661.100);
    });
    test('t2d converts time string to duration correctly', () => {
        expect(DT.t2d('01:01:01.000')).toBe(3661.000);
    });
    test('t2d converts time string to duration correctly', () => {
        console.log(DT.t2d('00:00:00.050'));
        expect(DT.t2d('00:00:00.050')).toBe(0.05);
    });
    
    test('t2d converts time string to duration correctly', () => {
        expect(DT.t2d('00:00:00.1')).toBe(0.1);
    });

    test('d2t throws error for incorrect duration format', () => {
        expect(() => DT.d2t('incorrect')).toThrow('The format of the duration is incorrect: incorrect');
    });

    test('t2d throws error for incorrect time format', () => {
        expect(() => DT.t2d('incorrect')).toThrow('The format of the time is incorrect: incorrect');
    });
});