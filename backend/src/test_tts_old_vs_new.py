from time import perf_counter_ns

import numpy as np

from old_model import compute_probs as old_compute_probs
from tts import compute_probs as new_compute_probs


def random_vec(len_):
    v = np.random.rand(len_)
    return v / np.sum(v)


def test(cases):
    np.random.seed(1)
    comparisons = 0
    start = perf_counter_ns()
    for _ in range(cases):
        az_vec = random_vec(3)
        age_vec = random_vec(8)
        sex_vec = random_vec(2)
        variant_vec = random_vec(2)
        ct_vec = random_vec(10)

        old = old_compute_probs(az_vec, age_vec, sex_vec, variant_vec, ct_vec)
        new = old_compute_probs(az_vec, age_vec, sex_vec, variant_vec, ct_vec)
        for a, b in zip(old, new):
            assert np.max(np.abs(a - b)) < 1e-6
            comparisons += 1
    end = perf_counter_ns()
    print(
        f"Ran {cases} random cases with {comparisons} comparisons, all OK. Took {(end - start) / cases / 1e6} ms per case."
    )
