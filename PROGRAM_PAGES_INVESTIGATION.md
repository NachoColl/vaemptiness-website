# Program Pages Investigation & Unification Plan

## Investigation Summary

### Template Structure (programa.njk)
All 4 programs use the same template with conditional sections:

1. **Hero Section** (always present)
2. **Pillars Section** (conditional: `{% if program.pillars %}`)
3. **Session Structure Section** (conditional: `{% if program.sessionStructure %}`)
4. **Outcomes Section** (conditional: `{% if program.outcomes %}`)
5. **Philosophy Section** (conditional: `{% if program.philosophy %}`)
6. **CTA Section** (always present)

---

## Content Analysis by Program

### 1. vaemptîness program (Adult)
**Sections present:**
- ✅ Hero
- ✅ Pillars (4 pillars)
- ❌ Session Structure (MISSING)
- ✅ Outcomes
- ✅ Philosophy

**Pillars (4):**
1. Observación de Pensamientos
2. Reducción de Rumiación
3. Claridad Cognitiva
4. Integración Somática

**Outcomes:**
- Title: "Beneficios"
- Items: 5 benefits focused on mental noise reduction, concentration, emotional balance

**Philosophy:**
"La rumiación no resuelve problemas, solo los repite. El enfoque se centra en pensar mejor en lugar de más, con resultados centrados en el rendimiento cognitivo mejorado y el equilibrio mental."

---

### 2. vaemptîness equipos (Teams)
**Sections present:**
- ✅ Hero
- ✅ Pillars (4 pillars)
- ❌ Session Structure (MISSING)
- ✅ Outcomes
- ✅ Philosophy

**Pillars (4):**
1. Observación de Pensamientos
2. Reducción de Rumiación
3. Claridad Cognitiva
4. Integración Somática

**Outcomes:**
- Title: "Beneficios"
- Items: 5 benefits (IDENTICAL to adult program)

**Philosophy:**
IDENTICAL to adult program (word-for-word)

**⚠️ CRITICAL ISSUE:** This program is 99% identical to the adult program. Only difference is hero.description mentions "entornos de trabajo colaborativo"

---

### 3. vaemptîness teen
**Sections present:**
- ✅ Hero
- ✅ Pillars (4 pillars)
- ❌ Session Structure (MISSING)
- ✅ Outcomes
- ✅ Philosophy

**Pillars (4):**
1. Autoconciencia
2. Regulación Emocional
3. Enfoque y Atención
4. Relaciones Conscientes

**Outcomes:**
- Title: "Resultados Esperados" (different from adult/equipos)
- Items: 5 results focused on teen-specific issues (academic stress, anxiety, resilience, healthy relationships)

**Philosophy:**
"Acompañando a los adolescentes en el desarrollo de herramientas que les permitan navegar esta etapa de cambio con mayor equilibrio y conciencia."

---

### 4. vaemptîness kids
**Sections present:**
- ✅ Hero
- ✅ Pillars (5 pillars - MORE than others!)
- ✅ Session Structure (ONLY program with this section!)
- ✅ Outcomes
- ✅ Philosophy

**Pillars (5):**
1. Cuerpo Tranquilo
2. Mente Tranquila
3. Emociones con Nombre
4. Espacio Interior
5. Amabilidad y Conexión

**Session Structure:**
- Duration: "20-30 minutos"
- 6 detailed activities (storytelling, breathing, movement, silence, creative activities, kindness closure)

**Outcomes:**
- Title: "Resultados del Aprendizaje" (different from others)
- Items: 5 results focused on emotional recognition, concentration in class, calm relationships

**Philosophy:**
"El programa prioriza comprender las experiencias internas orgánicamente en lugar del cumplimiento conductual, plantando 'semillas de autocuidado' para un impacto de por vida."

---

## Key Differences & Issues Found

### 🔴 Critical Issues

1. **MAJOR CONTENT DUPLICATION: Adult vs Equipos**
   - Equipos has IDENTICAL pillars to adult program (word-for-word)
   - Equipos has IDENTICAL outcomes to adult program (word-for-word)
   - Equipos has IDENTICAL philosophy to adult program (word-for-word)
   - **This makes equipos appear lazy and not tailored to teams**

2. **Missing Session Structure**
   - Adult: ❌ No session structure
   - Equipos: ❌ No session structure
   - Teen: ❌ No session structure
   - Kids: ✅ Has session structure
   - **Users can't understand what a session looks like for 3 out of 4 programs**

### 🟡 Medium Issues

3. **Inconsistent Outcomes Titles**
   - Adult/Equipos: "Beneficios"
   - Teen: "Resultados Esperados"
   - Kids: "Resultados del Aprendizaje"
   - **Should be unified to one term**

4. **Different Pillar Counts**
   - Adult: 4 pillars
   - Equipos: 4 pillars
   - Teen: 4 pillars
   - Kids: 5 pillars
   - **Not necessarily bad, but worth noting**

### 🟢 What's Working Well

5. **Consistent Philosophy Section**
   - All 4 programs have philosophy quotes
   - All use the same `.quote-emphasis` styling
   - Good for brand consistency

6. **Template Flexibility**
   - Conditional sections allow each program to have unique content
   - Currently underutilized for Adult/Equipos/Teen

---

## Unification Plan

### Phase 1: Differentiate Equipos Program (CRITICAL)

**Problem:** Equipos is 99% copy-paste from Adult program

**Solution:** Create unique content for equipos focused on team dynamics:

#### New Pillars for Equipos:
1. **Comunicación Consciente** - Escuchar y expresar sin reactividad emocional automática
2. **Claridad Colectiva** - Reducir ruido mental que afecta la toma de decisiones en equipo
3. **Gestión de Conflicto Cognitivo** - Reconocer patrones de pensamiento que generan tensión grupal
4. **Cohesión a través de la Presencia** - Crear espacios de trabajo donde la atención compartida mejora el rendimiento

#### New Outcomes for Equipos:
- Mejor comunicación entre miembros del equipo
- Reducción de conflictos derivados de malentendidos
- Mayor eficiencia en reuniones y toma de decisiones
- Ambiente de trabajo más equilibrado
- Capacidad de regulación emocional colectiva

#### New Philosophy for Equipos:
"Un equipo que piensa con claridad, colabora con eficacia. El entrenamiento mental colectivo transforma la dinámica grupal desde la conciencia individual hacia el rendimiento compartido."

---

### Phase 2: Add Session Structure to Missing Programs

**Problem:** Only kids has sessionStructure. Adult, Equipos, Teen are missing it.

**Solution:** Add sessionStructure to all 3 programs:

#### vaemptîness program (Adult) - Session Structure:
```json
"sessionStructure": {
  "title": "Estructura de las Sesiones",
  "duration": "60 minutos",
  "activities": [
    "Práctica de observación corporal (body scan)",
    "Técnicas de respiración para reducir rumiación",
    "Ejercicio de observación de pensamientos",
    "Integración somática mediante movimiento consciente",
    "Cierre con práctica de claridad cognitiva"
  ]
}
```

#### vaemptîness equipos (Teams) - Session Structure:
```json
"sessionStructure": {
  "title": "Estructura de las Sesiones",
  "duration": "75-90 minutos",
  "activities": [
    "Check-in grupal de estado mental",
    "Práctica de comunicación consciente en parejas",
    "Ejercicio de observación de patrones de pensamiento colectivos",
    "Dinámica de resolución de conflicto cognitivo",
    "Integración y establecimiento de compromisos de equipo"
  ]
}
```

#### vaemptîness teen - Session Structure:
```json
"sessionStructure": {
  "title": "Estructura de las Sesiones",
  "duration": "45-60 minutos",
  "activities": [
    "Circle time: compartir estado emocional del día",
    "Práctica de respiración y regulación emocional",
    "Ejercicio de enfoque y atención",
    "Actividad de relaciones conscientes (role-playing o discusión)",
    "Cierre con reflexión personal y establecimiento de intenciones"
  ]
}
```

---

### Phase 3: Unify Outcomes Titles

**Problem:** 3 different titles for the outcomes section

**Recommendation:** Use "Beneficios" for all programs
- More direct and clear
- Users understand "benefits" immediately
- "Resultados Esperados" and "Resultados del Aprendizaje" feel more formal/academic

**Changes needed:**
- Teen: "Resultados Esperados" → "Beneficios"
- Kids: "Resultados del Aprendizaje" → "Beneficios"
- Adult/Equipos: Keep "Beneficios" ✅

---

## Implementation Checklist

### High Priority (Do First):
- [ ] Rewrite equipos pillars with team-focused content
- [ ] Rewrite equipos outcomes with team-focused benefits
- [ ] Rewrite equipos philosophy with team-focused message
- [ ] Add sessionStructure to adult program
- [ ] Add sessionStructure to equipos program
- [ ] Add sessionStructure to teen program

### Medium Priority:
- [ ] Unify outcomes titles to "Beneficios" (teen and kids)

### Optional Enhancements:
- [ ] Review if all programs should have exactly 4 pillars (kids has 5)
- [ ] Consider adding testimonials section to template
- [ ] Consider adding pricing/enrollment info section to template

---

## Files to Modify

1. **Data file:** `/mnt/x/Git/nacho.coll/vaemptiness-website/src/data/programs.json`
   - Lines 48-93: Rewrite equipos program content
   - Lines 36-46: Add sessionStructure to adult program (after line 35)
   - Lines 82-92: Add sessionStructure to equipos program
   - Lines 128-138: Add sessionStructure to teen program
   - Lines 129, 192: Change outcomes titles to "Beneficios"

2. **Template:** No changes needed - already supports all sections conditionally

---

## Expected Impact

### Before Fix:
- Equipos looks like lazy copy-paste of adult program
- Users don't know what sessions look like for 3/4 programs
- Inconsistent terminology across programs

### After Fix:
- Each program has unique, tailored content
- Users understand session format for all programs
- Consistent terminology and structure
- More professional and complete program pages
