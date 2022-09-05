export const debounce = (fn, delay = 0) => {
  let timerId;

  return (...arguments_) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn(...arguments_);
      timerId = null;
    }, delay);
  };
};

export const getByPath = (object, path) => {
  if (!path) {
    return null;
  }

  return path.split('.').reduce((acc, value) => acc[value], object);
};

export const getProp = (object, path, defaultValue) => {
  if (!path) {
    return object;
  }

  const normalizedPath = Array.isArray(path) ? path : path.split('.').filter(item => item.length);

  if (!normalizedPath.length) {
    return object === undefined ? defaultValue : object;
  }

  return getProp(object[normalizedPath.shift()], normalizedPath, defaultValue);
};

export const hexToRGBA = (hex, alpha) => {
  let parsedHex = hex;

  if (hex.length === 4) {
    parsedHex = `${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}}`;
  }

  const RR = parseInt(parsedHex.slice(1, 3), 16);
  const GG = parseInt(parsedHex.slice(3, 5), 16);
  const BB = parseInt(parsedHex.slice(5, 7), 16);

  return `rgba(${RR}, ${GG}, ${BB}${alpha && `, ${alpha}`})`;
};

export const isomorphicWindow = () => {
  if (typeof window === 'undefined') {
    global.window = {};
  }

  return window;
};

export const valueExistInSelected = (value, values, props) =>
  !!values.some(
    data =>
      getByPath(data, props.valueField) === value || getByPath(data, props.labelField) === value,
  );
