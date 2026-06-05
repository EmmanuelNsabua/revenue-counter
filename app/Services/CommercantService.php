<?php

namespace App\Services;

use App\Repositories\CommercantRepository;
use App\Models\Commercant;
use Illuminate\Database\Eloquent\Collection;

class CommercantService
{
    protected CommercantRepository $commercantRepository;

    public function __construct(CommercantRepository $commercantRepository)
    {
        $this->commercantRepository = $commercantRepository;
    }

    public function rechercher(string $query): Collection
    {
        return $this->commercantRepository->search($query);
    }

    public function enregistrer(array $data): Commercant
    {
        return $this->commercantRepository->create($data);
    }

    public function modifier(int $id, array $data): bool
    {
        return $this->commercantRepository->update($id, $data);
    }
}
