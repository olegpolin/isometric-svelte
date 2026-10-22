/**
 * Whether the landing hero is showing its flat elevation. The hero sets it; the overlaid site
 * header reads it, because in the flat view the field turns to paper and the header's text has to
 * turn to ink with it. Only ever true on the client.
 */
export const heroState = $state({ flat: false });
