export interface IDetailedDocument {
    name: String;
    description?: String;
    _sheetGroups?: any[]; // metadata only
    _sheets?: any[];  // metadata only
    _entries?: any[]; // all available entries
    _sum?: any[];
}