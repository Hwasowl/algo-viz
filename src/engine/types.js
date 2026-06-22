/**
 * @typedef {Object} Step
 * @property {number} line  - 좌측 코드 하이라이트 줄(1-based)
 * @property {Object} state - 우측 시각화 스냅샷(토픽별)
 * @property {string} [note]- 스텝 설명 한 줄
 */

/**
 * 스텝 1개 생성. state는 매 스텝 깊은 복사하여
 * 이후 변형이 과거 스텝을 오염시키지 않게 한다.
 * @returns {Step}
 */
export function makeStep(line, state, note = '') {
  return { line, state: structuredClone(state), note }
}
