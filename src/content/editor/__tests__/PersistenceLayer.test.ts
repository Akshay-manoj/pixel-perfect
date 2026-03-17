import { PersistenceLayer } from '../PersistenceLayer';
import type { CSSOverride } from '@shared/types/editor.types';
import * as storageUtils from '@shared/utils/storage.utils';

jest.mock('@shared/utils/storage.utils');

const mockedGetOverrides = storageUtils.getOverrides as jest.MockedFunction<typeof storageUtils.getOverrides>;
const mockedSaveOverride = storageUtils.saveOverride as jest.MockedFunction<typeof storageUtils.saveOverride>;
const mockedDeleteOverride = storageUtils.deleteOverride as jest.MockedFunction<typeof storageUtils.deleteOverride>;

function makeOverride(id: string): CSSOverride {
  return {
    id,
    selector: '.card',
    property: 'margin-top',
    originalValue: '16px',
    newValue: '24px',
    timestamp: Date.now(),
    enabled: true,
    domain: '',
  };
}

describe('PersistenceLayer', () => {
  let layer: PersistenceLayer;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetOverrides.mockResolvedValue([]);
    mockedSaveOverride.mockResolvedValue(undefined);
    mockedDeleteOverride.mockResolvedValue(undefined);
    layer = new PersistenceLayer();
  });

  it('should call saveOverride on storage utils', async () => {
    await layer.saveOverride(makeOverride('1'));
    expect(mockedSaveOverride).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('should call deleteOverride on storage utils', async () => {
    await layer.deleteOverride('1');
    expect(mockedDeleteOverride).toHaveBeenCalledWith('1', expect.any(String));
  });

  it('should load and apply enabled overrides', async () => {
    const el = document.createElement('div');
    el.className = 'card';
    document.body.appendChild(el);

    mockedGetOverrides.mockResolvedValue([makeOverride('1')]);
    await layer.loadAndApply();

    expect(el.style.getPropertyValue('margin-top')).toBe('24px');
    el.remove();
  });

  it('should not apply disabled overrides', async () => {
    const el = document.createElement('div');
    el.className = 'card';
    document.body.appendChild(el);

    const override = makeOverride('1');
    override.enabled = false;
    mockedGetOverrides.mockResolvedValue([override]);
    await layer.loadAndApply();

    expect(el.style.getPropertyValue('margin-top')).toBe('');
    el.remove();
  });

  it('should clear all overrides for domain', async () => {
    mockedGetOverrides.mockResolvedValue([makeOverride('1'), makeOverride('2')]);
    await layer.clearDomain();
    expect(mockedDeleteOverride).toHaveBeenCalledTimes(2);
  });

  it('should call getOverrides with current domain', async () => {
    await layer.loadAndApply();
    expect(mockedGetOverrides).toHaveBeenCalledWith(expect.any(String));
  });

  it('should handle loadAndApply when no overrides exist', async () => {
    mockedGetOverrides.mockResolvedValue([]);
    await expect(layer.loadAndApply()).resolves.not.toThrow();
  });

  it('should handle invalid selectors gracefully', async () => {
    const override = makeOverride('1');
    override.selector = '[[[invalid';
    mockedGetOverrides.mockResolvedValue([override]);
    await expect(layer.loadAndApply()).resolves.not.toThrow();
  });
});
