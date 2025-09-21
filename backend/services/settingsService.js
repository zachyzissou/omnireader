import db from '../db.js';

function serialize(value) {
  return JSON.stringify(value ?? {});
}

function deserialize(record) {
  if (!record) return null;
  try {
    return JSON.parse(record.value);
  } catch (error) {
    console.error('Failed to parse settings value', error);
    return null;
  }
}

export async function getSetting(key) {
  const record = await db('settings').where({ key }).first();
  const value = deserialize(record);
  if (!value) return null;
  return {
    key,
    value,
  };
}

export async function upsertSetting(key, value) {
  const payload = {
    key,
    value: serialize(value),
    updated_at: db.fn.now(),
  };

  const existing = await db('settings').where({ key }).first();

  if (existing) {
    await db('settings').where({ key }).update(payload);
  } else {
    payload.created_at = db.fn.now();
    await db('settings').insert(payload);
  }

  return getSetting(key);
}
