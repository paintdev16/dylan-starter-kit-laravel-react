<?php

namespace App\Concerns;

trait NormalizesAccessControlIds
{
    /**
     * Validate and normalize a list of positive integer identifiers.
     *
     * @return list<int>|null
     */
    protected function normalizeIds(mixed $ids): ?array
    {
        if (! is_array($ids)) {
            return null;
        }

        $normalized = [];

        foreach ($ids as $id) {
            if (is_int($id) && $id > 0) {
                $normalized[] = $id;
            } elseif (is_string($id) && ctype_digit($id) && (int) $id > 0) {
                $normalized[] = (int) $id;
            } else {
                return null;
            }
        }

        return array_values(array_unique($normalized));
    }
}
