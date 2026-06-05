<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditObserver
{
    public function created(Model $model): void
    {
        $this->log('create', $model);
    }

    public function updated(Model $model): void
    {
        $details = [
            'changes' => $model->getChanges(),
            'original' => array_intersect_key($model->getOriginal(), $model->getDirty()),
        ];
        $this->log('update', $model, $details);
    }

    public function deleted(Model $model): void
    {
        $this->log('delete', $model);
    }

    protected function log(string $action, Model $model, ?array $details = null): void
    {
        // Don't log logs themselves to prevent recursion
        if ($model instanceof AuditLog) {
            return;
        }

        try {
            AuditLog::create([
                'agent_id' => Auth::id(),
                'action' => $action,
                'model_type' => get_class($model),
                'model_id' => $model->getKey(),
                'details' => $details ?? ['attributes' => $model->getAttributes()],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            // Silence log errors to avoid blocking business transaction
            logger()->error('Failed to write audit log: ' . $e->getMessage());
        }
    }
}
