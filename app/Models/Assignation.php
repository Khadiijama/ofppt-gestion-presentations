<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assignation extends Model
{
    use HasFactory;

    protected $fillable = [
        'presentation_id',
        'stagiaire_id',
    ];

    /**
     * La présentation assignée.
     */
    public function presentation(): BelongsTo
    {
        return $this->belongsTo(Presentation::class);
    }

    /**
     * Le stagiaire assigné.
     */
    public function stagiaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'stagiaire_id');
    }
}
