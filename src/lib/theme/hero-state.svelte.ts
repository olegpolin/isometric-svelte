/**
 * What the landing hero is showing. The hero sets it; the overlaid site header reads it. `flat`
 * is true once the monument has turned to its flat elevation, where the field turns to paper and
 * the header's text has to turn to ink with it. `done` is true once the stage has been scrolled
 * through, when the header gains its background so it stops floating over the sections below.
 * Both are only ever true on the client.
 */
export const heroState = $state({ flat: false, done: false });
